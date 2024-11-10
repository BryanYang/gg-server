import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Body,
  Request,
  Delete,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Case } from 'src/models/case';
import { CaseService } from './case.service';
import { CaseStudy } from 'src/models/case-study';
import { UserAnswer } from 'src/models/user-answer';
import { Institution } from 'src/models/institution';
import { Exercise } from 'src/models/exercise';
import { ExerciseOption } from 'src/models/exercise-option';
import { omit, get } from 'lodash';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

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

  @Post(':id/rate')
  async rateCase(
    @Param('id') id: number,
    @Body() data: { score: number },
    @Request() req,
  ): Promise<void> {
    this.caseService.rateCase(id, data.score, req.user);
  }

  @Get(':caseID/study/:userID')
  async getStudy(
    @Param() params: { caseID: number; userID: number; id: number },
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

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // 设置文件存储路径，假设这里为临时缓存目录
        destination: join(__dirname, '../../cache/uploads'),
        // 定义文件名，避免重复
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const originalName = file.originalname.replace(/\s+/g, '-'); // 去除空格
          const fileExt = originalName.split('.').pop(); // 获取文件扩展名
          const newFileName = `${uniqueSuffix}.${fileExt}`;
          callback(null, newFileName);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File, // 获取上传的文件
    @Body() data: Partial<Case>,
  ): Promise<Case | null> {
    return this.caseService.create({
      ...data,
      types: get(data, 'types', '').split(','),
      pic: '/uploads/' + file.filename,
    });
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

  @Get('study/user/:id/list')
  @UseGuards(RolesGuard)
  @Roles('teacher')
  async getStudiesByUserID(
    @Param() params: { id: number },
  ): Promise<CaseStudy[]> {
    return this.caseService.getStudies(params.id);
  }

  @Get('study/:studyID/all')
  async getAllStudies(
    @Param() params: { studyID: number },
  ): Promise<CaseStudy[]> {
    return this.caseService.getAllStudies(params.studyID);
  }

  @Get('study/list/:id')
  async getStudyByID(@Param() params: { id: number }): Promise<CaseStudy> {
    return this.caseService.findStudyByID(params.id);
  }
}
