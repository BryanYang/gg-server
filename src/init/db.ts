import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../config/db'; // 导入数据库配置
import { User } from '../user/users.model'; // 导入 User 模型

async function createTables() {
  const sequelize = new Sequelize(databaseConfig.uri); // 创建 Sequelize 实例

  // 同步模型并自动创建数据库表
  await sequelize.addModels([User]); // 添加 User 模型
  await sequelize.sync({ force: true }); // 根据模型创建表，force: true 表示删除已存在的表
  console.log('Users 表已创建');
}

createTables().catch((error) => {
  console.error('创建表时发生错误：', error);
});
