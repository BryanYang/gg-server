import { Module } from '@nestjs/common';
import { CaseController } from './case.controller';
import { CaseService } from './case.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Case } from '../models/case';
import { ExerciseOption } from '../models/exercise-option';
import { Exercise } from '../models/exercise';
import { Institution } from 'src/models/institution';
import { CaseStudy } from 'src/models/case-study';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Case,
      Exercise,
      ExerciseOption,
      Institution,
      CaseStudy,
    ]),
  ],
  controllers: [CaseController],
  providers: [CaseService],
})
export class CaseModule {}
