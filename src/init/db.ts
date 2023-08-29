import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../config/db'; // 导入数据库配置
import { User } from '../user/users.model'; // 导入 User 模型
import { Case } from '../models/case';
import { Exercise } from '../models/exercise';
import { ExerciseOption } from '../models/exercise-option';
import { Institution } from '../models/institution';
import { CaseStudy } from '../models/case-study';

async function createTables() {
  const sequelize = new Sequelize(databaseConfig.uri); // 创建 Sequelize 实例

  // 同步模型并自动创建数据库表
  await sequelize.addModels([
    User,
    ExerciseOption,
    Exercise,
    Case,
    CaseStudy,
    Institution,
  ]);
  await sequelize.sync({ force: false }); // 根据模型创建表，force: true 表示删除已存在的表
  console.log('表已创建');
}

createTables().catch((error) => {
  console.error('创建表时发生错误：', error);
});
