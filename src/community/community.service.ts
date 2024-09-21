import { map, filter } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from 'src/models/post';
import { Comment } from 'src/models/comment';
import { StarLike } from 'src/models/star-like';
import { Op } from 'sequelize';
import { User } from 'src/models/user';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Post) private postModel: typeof Post,
    @InjectModel(StarLike) private starLikeModel: typeof StarLike,
    @InjectModel(Comment) private commentModel: typeof Comment,
  ) {}

  async fetch(
    params: {
      search: string;
      page: number;
      order: string;
      tag?: string;
    },
    userID: number,
  ) {
    const { tag } = params;
    if (tag === 'myStar' || tag === 'myLike' || tag === 'myPost') {
      let postIDs = [];
      if (tag === 'myStar') {
        const myStar = await this.starLikeModel.findAll({
          where: {
            userID,
            star: true,
          },
        });
        postIDs = map(myStar, (s) => s.postID);
      }

      if (tag === 'myLike') {
        const myLike = await this.starLikeModel.findAll({
          where: {
            userID,
            like: true,
          },
        });
        postIDs = map(myLike, (s) => s.postID);
      }

      if (postIDs.length) {
        const res = await this.postModel.findAndCountAll({
          where: {
            id: postIDs,
          },
          limit: 10,
          offset: (params.page || 1) - 1,
          order:
            params.order !== 'time'
              ? [['createdAt', 'desc']]
              : [['updatedAt', 'desc']],
        });
        for (const i in res.rows) {
          const item = res.rows[i];
          item.dataValues.star = await this.starLikeModel.count({
            where: {
              postID: item.id,
              star: true,
            },
          });

          item.dataValues.like = await this.starLikeModel.count({
            where: {
              postID: item.id,
              like: true,
            },
          });

          item.dataValues.comment = await this.commentModel.count({
            where: {
              postID: item.id,
              isDeleted: false,
            },
          });
        }
        return res;
      }

      if (tag === 'myPost') {
        const res = await this.postModel.findAndCountAll({
          where: {
            userID,
          },
          limit: 10,
          offset: (params.page || 1) - 1,
          order:
            params.order !== 'time'
              ? [['createdAt', 'desc']]
              : [['updatedAt', 'desc']],
        });
        for (const i in res.rows) {
          const item = res.rows[i];
          item.dataValues.star = await this.starLikeModel.count({
            where: {
              postID: item.id,
              star: true,
            },
          });

          item.dataValues.like = await this.starLikeModel.count({
            where: {
              postID: item.id,
              like: true,
            },
          });

          item.dataValues.comment = await this.commentModel.count({
            where: {
              postID: item.id,
              isDeleted: false,
            },
          });
        }
        return res;
      }
    }
    const res = await this.postModel.findAndCountAll({
      where: params.search
        ? {
            title: {
              [Op.like]: `%${params.search}%`,
            },
            isDeleted: {
              [Op.not]: true,
            },
          }
        : {
            isDeleted: {
              [Op.not]: true,
            },
          },
      limit: 10,
      offset: (params.page || 1) - 1,
      order:
        params.order !== 'time'
          ? [['createdAt', 'desc']]
          : [['updatedAt', 'desc']],
    });

    const rows = res.rows;
    for (const i in rows) {
      const item = rows[i];
      item.dataValues.star = await this.starLikeModel.count({
        where: {
          postID: item.id,
          star: true,
        },
      });

      item.dataValues.like = await this.starLikeModel.count({
        where: {
          postID: item.id,
          like: true,
        },
      });

      item.dataValues.comment = await this.commentModel.count({
        where: {
          postID: item.id,
          isDeleted: false,
        },
      });
    }

    return res;
  }

  async create(data: Partial<Post>): Promise<Post> {
    if (data.id) {
      const res = await this.postModel.findByPk(data.id);
      if (res) {
        res.update(data);
      }
      await res.reload();
      return res;
    } else {
      return await this.postModel.create(data);
    }
  }

  async delete(id: number, userID: number): Promise<void> {
    await this.postModel.destroy({
      where: {
        id,
        userID,
      },
    });
  }

  async retrieveStarLike(userID: number): Promise<{
    star: number[];
    like: number[];
  }> {
    const res = await this.starLikeModel.findAll({
      where: {
        userID,
      },
    });

    const star = map(
      filter(res, (it) => it.star),
      (it) => it.postID,
    );
    const like = map(
      filter(res, (it) => it.like),
      (it) => it.postID,
    );

    return {
      star,
      like,
    };
  }

  async starLike(data: Partial<StarLike>): Promise<void> {
    const found = await this.starLikeModel.findOne({
      where: {
        userID: data.userID,
        postID: data.postID,
      },
    });
    if (found) {
      await found.update({
        star: data.star ? !found.star : found.star,
        like: data.like ? !found.like : found.like,
      });
    } else {
      await this.starLikeModel.create(data);
    }
  }

  async commentList(ids: number[]): Promise<Comment[]> {
    return await this.commentModel.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'email', 'class'],
        },
      ],
      where: { id: ids, isDeleted: null },
    });
  }

  async comment(data: Partial<Comment>): Promise<void> {
    await this.commentModel.create(data);
  }

  async delComment(id: number, userID: number): Promise<void> {
    await this.commentModel.destroy({
      where: {
        id,
        userID,
      },
    });
  }
}
