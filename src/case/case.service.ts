import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Case } from 'src/models/case';
import { Exercise } from '../models/exercise';
import { ExerciseOption } from '../models/exercise-option';
import { Institution } from '../models/institution';
import { CaseStudy } from '../models/case-study';
import { UserAnswer } from 'src/models/user-answer';
import { map, omit } from 'lodash';

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case) private caseModel: typeof Case,
    @InjectModel(Institution) private institutionModal: typeof Institution,
    @InjectModel(Exercise) private exerciseModal: typeof Exercise,
    @InjectModel(ExerciseOption)
    private exerciseOptionModal: typeof ExerciseOption,
    @InjectModel(CaseStudy) private caseStudyModel: typeof CaseStudy,
    @InjectModel(UserAnswer) private userAnswerModel: typeof UserAnswer,
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
      ],
    });
  }

  async create(data: Partial<Case>): Promise<Case | null> {
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

  async updateStudy(data: Partial<CaseStudy>): Promise<CaseStudy> {
    const study = await this.caseStudyModel.findByPk(data.id);
    if (!study) {
      throw new HttpException('未找到该案例', HttpStatus.BAD_REQUEST);
    }
    return study.update(data);
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

  async getAnswer(studyId): Promise<UserAnswer[]> {
    return await this.userAnswerModel.findAll({
      where: {
        caseStudyID: studyId,
      },
    });
  }

  async getStudies(userID): Promise<CaseStudy[]> {
    return this.caseStudyModel.findAll({
      where: {
        userID,
      },
      include: [Case],
    });
  }
}
