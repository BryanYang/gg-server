import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'user_study' })
export class UserStudy extends Model<UserStudy> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true, // 设置为主键
    autoIncrement: true, // 自动增长
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  caseID: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userID: number;

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
    type: DataType.INTEGER,
    allowNull: true,
  })
  reportID: number;
}
