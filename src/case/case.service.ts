import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { difference } from 'lodash';
import * as moment from 'moment';
import { Case } from '../models/case';
import { Exercise } from '../models/exercise';
import { ExerciseOption } from '../models/exercise-option';
import { Institution } from '../models/institution';
import { CaseStudy } from '../models/case-study';
import { UserAnswer } from '../models/user-answer';
import { map, omit } from 'lodash';
import { User } from '../models/user';
import { Post } from '../models/post';
import { adminEmail } from '../utils/user';

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case) private caseModel: typeof Case,
    @InjectModel(Post) private postModel: typeof Post,
    @InjectModel(Institution) private institutionModal: typeof Institution,
    @InjectModel(Exercise) private exerciseModal: typeof Exercise,
    @InjectModel(ExerciseOption)
    private exerciseOptionModal: typeof ExerciseOption,
    @InjectModel(CaseStudy) private caseStudyModel: typeof CaseStudy,
    @InjectModel(UserAnswer) private userAnswerModel: typeof UserAnswer,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async findAll(): Promise<Case[]> {
    return await this.caseModel.findAll();
  }

  async find(id: number): Promise<Case> {
    return await this.caseModel.findByPk(id, {
      include: [
        {
          model: Exercise,
          include: [
            {
              model: ExerciseOption,
            },
            {
              model: Institution,
            },
          ],
        },
        {
          model: Institution,
        },
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: CaseStudy,
          attributes: ['id', 'caseRate', 'userID'],
        },
      ],
    });
  }

  async create(data: Partial<Case>): Promise<Case | null> {
    console.log(data.id);
    if (data.id) {
      const it = await this.caseModel.findByPk(data.id);
      return await it.update(data);
    }
    return await this.caseModel.create({ status: 0, ...data });
  }

  async createIns(data: Partial<Institution>[]): Promise<Institution[]> {
    return await Promise.all(
      map(data, async (record: Partial<Institution>) => {
        if (record.id) {
          const it = await this.institutionModal.findByPk(record.id);
          return await it.update(record);
        }
        return this.institutionModal.create(record);
      }),
    );
  }

  async createExercise(
    data: Partial<Exercise> & {
      optionList?: { description: string; id?: number }[];
    },
  ): Promise<Exercise | null> {
    let res: Exercise | null = null;
    if (data.id) {
      const it = await this.exerciseModal.findByPk(data.id);
      res = await it.update(omit(data, 'optionList'));
    } else {
      res = await this.exerciseModal.create(omit(data, ['optionList']));
    }
    if (data.optionList) {
      await this.exerciseOptionModal.destroy({
        where: { exerciseID: res.id },
      });
      await this.exerciseOptionModal.bulkCreate(
        data.optionList.map((op) => ({
          description: op.description,
          exerciseID: res.id,
        })),
      );
    }
    return res;
  }

  async removeExercise(id: number) {
    const item = await this.exerciseModal.findByPk(id);
    await this.exerciseOptionModal.destroy({ where: { exerciseID: item.id } });
    if (item) {
      await item.destroy();
    }
  }

  async createExerciseOption(
    data: Partial<ExerciseOption>,
  ): Promise<ExerciseOption | null> {
    if (data.id) {
      const it = await this.exerciseOptionModal.findByPk(data.id);
      return await it.update(data);
    }
    return await this.exerciseOptionModal.create(data);
  }

  async findStudy({
    caseID,
    userID,
  }: {
    caseID: number;
    userID: number;
  }): Promise<CaseStudy | null> {
    return this.caseStudyModel.findOne({
      where: {
        caseID,
        userID,
      },
    });
  }

  async findStudyByID(id: number): Promise<CaseStudy | null> {
    return this.caseStudyModel.findOne({
      where: {
        id,
      },
      include: [Case, User],
    });
  }

  async rateCase(caseID: number, score: number, user: User): Promise<void> {
    const study = await this.caseStudyModel.findOne({
      where: {
        userID: user.id,
        caseID,
      },
    });
    if (study) {
      study.update({
        caseRate: score,
      });
    }
  }

  async updateStudy(data: Partial<CaseStudy>, user: User): Promise<CaseStudy> {
    const study = await this.caseStudyModel.findByPk(data.id, {
      include: [User, Case],
    });
    if (!study) {
      await this.caseStudyModel.create({
        currentStep: 1,
        ...data,
        userID: user.id,
        state: 0,
        startDate: new Date(),
      });
      return;
    }

    // Finish, 生成post
    if (data.currentStep === 4) {
      const admin = await this.userModel.findOne({
        where: {
          email: adminEmail,
        },
      });
      const time = moment().diff(moment(study.startDate), 'minute');
      const [, sum, total] = await this.calculateScore(study.id);
      await this.postModel.create({
        userID: admin.id,
        description: '',
        image: study.case.pic,
        title: `恭喜${study.user.username}完成了测试!`,
        content: `用时${time}分钟; 分数 ${sum}/${total}`,
      });
    }
    return study.update({
      ...data,
      endDate: data.currentStep === 4 ? new Date() : undefined,
    });
  }

  async createAnswer(data: Partial<UserAnswer>): Promise<number> {
    await this.userAnswerModel.destroy({
      where: {
        caseStudyID: data.caseStudyID,
        exerciseID: data.exerciseID,
      },
    });
    const answer = await this.userAnswerModel.create(data);
    return answer.id;
  }

  async removeAnswer(id: number): Promise<void> {
    await this.userAnswerModel.destroy({
      where: {
        caseStudyID: id,
      },
    });
  }

  async getAnswer(studyId: number): Promise<UserAnswer[]> {
    return await this.userAnswerModel.findAll({
      where: {
        caseStudyID: studyId,
      },
      include: [
        {
          model: Exercise,
          include: [ExerciseOption],
        },
      ],
    });
  }

  async getStudies(userID): Promise<CaseStudy[]> {
    return this.caseStudyModel.findAll({
      where: {
        userID,
      },
      include: [
        {
          model: Case,
          include: [
            {
              model: CaseStudy,
              attributes: ['id'],
            },
          ],
        },
      ],
    });
  }

  async getAllStudies(caseID: number): Promise<CaseStudy[]> {
    return this.caseStudyModel.findAll({
      where: {
        caseID,
      },
      include: [
        {
          model: User,
          attributes: ['username', 'class'],
        },
      ],
    });
  }

  async calculateScore(
    studyId: number,
  ): Promise<[s: Record<number, number>, t: number, a: number]> {
    const answers = await this.getAnswer(studyId);
    const results = {};
    let totalScore = 0;
    let allScore = 0;
    for (const i in answers) {
      const exercise = answers[i].exercise;
      const correctAnswerNos = exercise.answerNos;
      const score = exercise.score;
      const result = answers[i].answers.map(Number);
      allScore += score;
      if (
        correctAnswerNos.length === result.length &&
        difference(correctAnswerNos, result).length === 0
      ) {
        results[exercise.id] = score;
        totalScore += score;
      } else {
        results[exercise.id] = 0;
      }
    }
    return [results, totalScore, allScore];
  }
}
