const port = process.env.NODE_ENV === 'production' ? 5432 : 5454;
const uri =
  process.env.NODE_ENV === 'production'
    ? 'postgres://gg:123123@db:5432/gg'
    : 'postgres://gg:123123@localhost:5454/gg';
export const databaseConfig = {
  dialect: 'postgres',
  host: 'localhost',
  port,
  username: 'gg',
  password: '123123',
  database: 'gg',
  autoLoadModels: true, // 自动加载模型
  uri,
};
