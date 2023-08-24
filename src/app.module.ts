import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { User } from './models/user'; // 导入 User 模型
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserController } from './controllers/user';
import { databaseConfig } from './config/db';
import { AuthModule } from './auth/auth.module';
// import { UsersController } from './user/user.controller';
// import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      uri: databaseConfig.uri,
      autoLoadModels: true,
      synchronize: true,
    }), // 配置数据库连接
    // SequelizeModule.forFeature([User]),
    AuthModule,
    UserModule, // 加载 User 模型
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
