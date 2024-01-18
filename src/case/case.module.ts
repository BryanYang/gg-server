import { Module } from '@nestjs/common';
import { CaseController } from './case.controller';
import { CaseService } from './case.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Case } from '../models/case';
import { ExerciseOption } from '../models/exercise-option';
import { Exercise } from '../models/exercise';
import { Institution } from '../models/institution';
import { CaseStudy } from '../models/case-study';
import { UserAnswer } from 'src/models/user-answer';
import { User } from 'src/models/user';
import { Post } from 'src/models/post';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Case,
      Exercise,
      ExerciseOption,
      Institution,
      CaseStudy,
      UserAnswer,
      User,
      Post,
    ]),
  ],
  controllers: [CaseController],
  providers: [CaseService],
})
export class CaseModule {}
