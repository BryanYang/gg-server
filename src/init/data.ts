import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../config/db'; // 导入数据库配置
import { User } from '../user/users.model'; // 导入 User 模型
import { Case } from '../models/case';
import { Exercise } from '../models/exercise';
import { ExerciseOption } from '../models/exercise-option';
import { Institution } from '../models/institution';
import { CaseStudy } from '../models/case-study';
import { UserAnswer } from '../models/user-answer';
import * as bcrypt from 'bcrypt';

async function insertData() {
  const sequelize = new Sequelize(databaseConfig.uri); // 创建 Sequelize 实例
  await sequelize.addModels([
    User,
    ExerciseOption,
    Exercise,
    Case,
    CaseStudy,
    Institution,
    UserAnswer,
  ]);
  const salt = bcrypt.genSaltSync(10);
  await sequelize.model('User').create({
    username: 'yang',
    email: 'yang',
    password: await bcrypt.hash('123123', salt),
    isTeacher: true,
  });
}

insertData()
  .then(() => {
    console.log('初始数据设置成功');
  })
  .catch((error) => {
    console.error('生成初始数据时发生错误：', error);
  });
