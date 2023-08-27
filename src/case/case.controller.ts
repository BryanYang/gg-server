import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Case } from 'src/models/case';
import { CaseService } from './case.service';

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
}
