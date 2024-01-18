import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { User } from 'src/models/user';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from 'src/models/post';
import { StarLike } from 'src/models/star-like';
import { Comment } from 'src/models/comment';

@Module({
  imports: [SequelizeModule.forFeature([User, Post, Comment, StarLike])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
