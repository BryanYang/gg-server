import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { ExerciseOption } from './exercise-option';

@Table({ tableName: 'exercises' })
export class Exercise extends Model<Exercise> {
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
  title: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  score: number;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
  })
  answerIDs: number[];

  @HasMany(() => ExerciseOption) // 定义一对多关系
  options: ExerciseOption[];
}
