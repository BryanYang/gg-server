import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'reports' })
export class Report extends Model<Report> {
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
}
