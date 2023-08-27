import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Case } from './case';
import { User } from './user';

@Table({ tableName: 'case_study' })
export class CaseStudy extends Model<CaseStudy> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true, // 设置为主键
    autoIncrement: true, // 自动增长
  })
  id: number;

  @ForeignKey(() => Case)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  caseID: number;

  @BelongsTo(() => Case)
  case: Case;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userID: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  startDate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  endDate: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  state: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: true,
  })
  currentStep: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  reportID: number;
}
