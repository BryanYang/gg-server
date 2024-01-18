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

@Table({ tableName: 'post' })
export class Post extends Model<
  InferAttributes<Post>,
  InferCreationAttributes<Post>
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
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted: boolean;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  like?: number;
  star?: number;
  comment?: number;
}
