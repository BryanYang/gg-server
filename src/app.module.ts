import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user'; // 导入 User 模型
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user';
import { UserService } from './services/user';
import { databaseConfig } from './config/db';

@Module({
  imports: [
    SequelizeModule.forRoot({
      uri: databaseConfig.uri,
      autoLoadModels: true,
      synchronize: true,
    }), // 配置数据库连接
    SequelizeModule.forFeature([User]), // 加载 User 模型
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
