import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Case } from 'src/models/case';
import { Exercise } from '../models/exercise';
import { ExerciseOption } from '../models/exercise-option';
import { Institution } from '../models/institution';

@Injectable()
export class CaseService {
  constructor(@InjectModel(Case) private caseModel: typeof Case) {}

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
}
