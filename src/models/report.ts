import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Case } from './case';
import { User } from './user';

@Table({ tableName: 'reports' })
export class Report extends Model<Report> {
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
}
