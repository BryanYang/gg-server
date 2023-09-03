import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'message' })
export class Message extends Model<Message> {
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
  userID: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  templateID: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  state: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted: boolean;
}
