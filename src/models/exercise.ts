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

  /** 题型 单选/多选/问答 */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

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
  answerNos: number[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  analysis: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  tip: string;

  @HasMany(() => ExerciseOption, { onDelete: 'CASCADE' }) // 定义一对多关系
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
