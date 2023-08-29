import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/db';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CaseModule } from './case/case.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      uri: databaseConfig.uri,
      autoLoadModels: true,
      synchronize: true,
    }), // 配置数据库连接
    AuthModule,
    UserModule,
    CaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
