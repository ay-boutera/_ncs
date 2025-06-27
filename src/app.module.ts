import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { OauthModule } from './oauth/oauth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './models/user/user.module';
import { ProductModule } from './models/product/product.module';
import { NotFoundExceptionFilter } from './common/middleware/notFoundException.middleware';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    OauthModule,
    UserModule,
    ProductModule,
  ],
  // The controllers and providers arrays are optional here, as they are automatically registered by the imported modules.
  controllers: [],
  providers: [],
})
export class AppModule {}
