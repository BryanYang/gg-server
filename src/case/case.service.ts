import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Case } from 'src/models/case';
import { Exercise } from '../models/exercise';
import { ExerciseOption } from '../models/exercise-option';
import { Institution } from '../models/institution';
import { CaseStudy } from '../models/case-study';
import { UserAnswer } from 'src/models/user-answer';

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case) private caseModel: typeof Case,
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
      ],
    });
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
