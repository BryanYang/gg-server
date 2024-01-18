import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Body,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Case } from 'src/models/case';
import { CaseService } from './case.service';
import { CaseStudy } from 'src/models/case-study';
import { UserAnswer } from 'src/models/user-answer';
import { Institution } from 'src/models/institution';
import { Exercise } from 'src/models/exercise';
import { ExerciseOption } from 'src/models/exercise-option';

@Controller('cases')
@UseGuards(AuthGuard)
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Get()
  async findAll(): Promise<Case[]> {
    return this.caseService.findAll();
  }

  @Get(':id')
  async getByID(@Param() params: { id: number }): Promise<Case> {
    return this.caseService.find(params.id);
  }

  @Get(':caseID/study/:userID')
  async getStudy(
    @Param() params: { caseID: number; userID: number },
  ): Promise<CaseStudy> {
    return this.caseService.findStudy(params);
  }

  @Put('study')
  async updateStudy(
    @Body() data: Partial<CaseStudy>,
    @Request() req,
  ): Promise<CaseStudy> {
    return this.caseService.updateStudy(data, req.user);
  }

  @Put()
  async create(@Body() data: Partial<Case>): Promise<Case | null> {
    return this.caseService.create(data);
  }

  @Put('institutions')
  async createIns(
    @Body() data: Partial<Institution>[],
  ): Promise<Institution[]> {
    return this.caseService.createIns(data);
  }

  @Put('exercise')
  async createExercise(
    @Body()
    data: Partial<Exercise> & {
      optionList?: { description: string; id?: number }[];
    },
  ): Promise<Exercise> {
    return this.caseService.createExercise(data);
  }

  @Put('exercise-option')
  async createExerciseOption(
    @Body() data: Partial<ExerciseOption>,
  ): Promise<ExerciseOption> {
    return this.caseService.createExerciseOption(data);
  }

  @Delete('study/:caseStudyID')
  async destroyAnswer(@Param() params: { caseStudyID: number }): Promise<void> {
    return this.caseService.removeAnswer(params.caseStudyID);
  }

  @Delete('exercise/:id')
  async destroyExercise(@Param() params: { id: number }): Promise<void> {
    return this.caseService.removeExercise(params.id);
  }

  @Put('study/answer')
  async createOrUpdateAnswer(
    @Body() data: Partial<UserAnswer>,
  ): Promise<number> {
    return this.caseService.createAnswer(data);
  }

  @Get('study/:studyID/answer')
  async getAnswer(@Param() params: { studyID: number }): Promise<UserAnswer[]> {
    return this.caseService.getAnswer(params.studyID);
  }

  @Get('study/list')
  async getStudies(@Request() req): Promise<CaseStudy[]> {
    return this.caseService.getStudies(req.user.id);
  }
}
