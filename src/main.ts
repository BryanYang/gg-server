import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 添加请求体解析中间件
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
