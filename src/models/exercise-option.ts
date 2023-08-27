import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Exercise } from './exercise';

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

  @ForeignKey(() => Exercise)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'exercise_id',
  })
  exerciseID: number;

  @BelongsTo(() => Exercise)
  exercise: Exercise;
}
