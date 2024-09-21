import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { Post as PostEntity } from 'src/models/post';
import { Comment } from 'src/models/comment';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('community')
@UseGuards(AuthGuard)
export class CommunityController {
  constructor(private readonly postService: CommunityService) {}

  @Get('posts')
  async getPosts(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('order') order: string,
    @Request() request,
    @Query('tag') tag?: string,
  ): Promise<{ rows: PostEntity[]; count: number }> {
    return this.postService.fetch(
      {
        search,
        page,
        order,
        tag,
      },
      request.user.id,
    );
  }

  @Get('starLike')
  async myStarLike(
    @Request() request,
  ): Promise<{ star: number[]; like: number[] }> {
    const userID = request.user.id;
    return this.postService.retrieveStarLike(userID);
  }

  @Get('comments')
  async list(@Query('ids') ids: number[]): Promise<Comment[]> {
    return this.postService.commentList(ids);
  }

  @Put('posts')
  async createPosts(
    @Body() data: Partial<PostEntity>,
    @Request() request,
  ): Promise<PostEntity> {
    return this.postService.create({
      ...data,
      userID: request.user.id,
    });
  }

  @Delete('posts/:id')
  async deletePosts(
    @Param() params: { id: number },
    @Request() request,
  ): Promise<void> {
    return this.postService.delete(params.id, request.user.id);
  }

  @Post('star/:id')
  async star(
    @Param() params: { id: number },
    @Request() request,
  ): Promise<void> {
    await this.postService.starLike({
      postID: params.id,
      userID: request.user.id,
      star: true,
    });
  }

  @Post('like/:id')
  async like(
    @Param() params: { id: number },
    @Request() request,
  ): Promise<void> {
    await this.postService.starLike({
      postID: params.id,
      userID: request.user.id,
      like: true,
    });
  }

  @Put('comment/:id')
  async comment(
    @Body() data: Partial<Comment>,
    @Request() request,
    @Param() params: { id: number },
  ): Promise<void> {
    await this.postService.comment({
      ...data,
      postID: params.id,
      userID: request.user.id,
    });
  }

  @Delete('comment/:id')
  async delComment(
    @Param() params: { id: number },
    @Request() request,
  ): Promise<void> {
    const userID = request.user.id;
    await this.postService.delComment(params.id, userID);
  }
}
