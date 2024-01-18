import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize/types/model';
import { Post } from './post';

@Table({ tableName: 'star_like' })
export class StarLike extends Model<
  InferAttributes<StarLike>,
  InferCreationAttributes<StarLike>
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true, // 设置为主键
    autoIncrement: true, // 自动增长
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userID: number;

  @BelongsTo(() => User) // 定义一对一关系
  user: User;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  postID: number;

  @BelongsTo(() => Post) // 定义一对一关系
  post: Post;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  star: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  like: boolean;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
