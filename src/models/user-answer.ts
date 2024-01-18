import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { CaseStudy } from './case-study';
import { Exercise } from './exercise';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'user_answer' })
export class UserAnswer extends Model<UserAnswer> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true, // 设置为主键
    autoIncrement: true, // 自动增长
  })
  id: number;

  @ForeignKey(() => CaseStudy)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  caseStudyID: number;

  @BelongsTo(() => CaseStudy)
  caseStudy: CaseStudy;

  @ForeignKey(() => Exercise)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  exerciseID: number;

  @BelongsTo(() => Exercise)
  exercise: Exercise;

  @Column({
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  })
  answers: string[];
}
