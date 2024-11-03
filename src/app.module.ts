import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/db';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CaseModule } from './case/case.module';
import { MessageModule } from './message/message.module';
import { ClassListModule } from './class-list/class-list.module';
import { CommunityModule } from './community/community.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'cache/uploads'),
      serveRoot: '/uploads', // 指定文件访问的 URL 前缀
    }),
    SequelizeModule.forRoot({
      uri: databaseConfig.uri,
      autoLoadModels: true, // 自动加载模型
      synchronize: true,
    }), // 配置数据库连接
    AuthModule,
    UserModule,
    CaseModule,
    MessageModule,
    ClassListModule,
    CommunityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
