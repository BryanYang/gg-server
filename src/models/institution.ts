import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { Exercise } from './exercise';
import { Case } from './case';

@Table({ tableName: 'institutions' })
export class Institution extends Model<Institution> {
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

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  orderNo: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Exercise) // 定义一对多关系
  exercises: Exercise[];
}
