import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Body,
  Request,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Case } from 'src/models/case';
import { CaseService } from './case.service';
import { CaseStudy } from 'src/models/case-study';
import { UserAnswer } from 'src/models/user-answer';

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
  async updateStudy(@Body() data: Partial<CaseStudy>): Promise<CaseStudy> {
    return this.caseService.updateStudy(data);
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
}
