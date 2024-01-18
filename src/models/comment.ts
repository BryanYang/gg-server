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

@Table({ tableName: 'comment' })
export class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

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
  isDeleted: boolean;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
