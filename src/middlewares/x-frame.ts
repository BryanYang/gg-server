import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DisableFrameguardMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 移除 X-Frame-Options 头部
    res.removeHeader('X-Frame-Options');
    next();
  }
}
