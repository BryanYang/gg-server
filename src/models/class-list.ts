import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user';

@Table({ tableName: 'class-list' })
export class ClassList extends Model<ClassList> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true, // 设置为主键
    autoIncrement: true, // 自动增长
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  teacherID: number;

  @BelongsTo(() => User) // 定义一对一关系
  teacher: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted: boolean;

  count?: number;
}
