import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Exercise } from './exercise';
import { CaseStudy } from './case-study';

@Table({ tableName: 'cases' })
export class Case extends Model<Case> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pic: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  videoUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  link: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  studyCount: number;

  @HasMany(() => Exercise) // 定义一对多关系
  exercises: Exercise[];

  @HasMany(() => CaseStudy) // 定义一对多关系
  caseStudies: CaseStudy[];
}
