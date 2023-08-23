import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'exercise_options' })
export class ExerciseOption extends Model<ExerciseOption> {
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
  description: string;
}
