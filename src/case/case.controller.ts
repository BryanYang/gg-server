import { Controller, UseGuards, Get, Param, Put, Body } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Case } from 'src/models/case';
import { CaseService } from './case.service';
import { CaseStudy } from 'src/models/case-study';

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
}
