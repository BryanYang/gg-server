import { Module } from '@nestjs/common';
import { ClassListController } from './class-list.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user';
import { ClassList } from 'src/models/class-list';
import { ClassListService } from './class-list.service';

@Module({
  imports: [SequelizeModule.forFeature([User, ClassList])],
  controllers: [ClassListController],
  providers: [ClassListService],
})
export class ClassListModule {}
