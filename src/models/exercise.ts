import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ExerciseOption } from './exercise-option';
import { Case } from './case';
import { Institution } from './institution';

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
    type: DataType.SMALLINT,
    allowNull: false,
  })
  step: number;

  @ForeignKey(() => Institution)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'institution_id',
  })
  institutionID: number;

  @BelongsTo(() => Institution)
  institution: Institution;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
  })
  answerIDs: number[];

  @HasMany(() => ExerciseOption) // 定义一对多关系
  options: ExerciseOption[];

  @ForeignKey(() => Case)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'case_id',
  })
  caseID: number;

  @BelongsTo(() => Case)
  case: Case;
}
