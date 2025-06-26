import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './models/user/user.module';
import { PostModule } from './models/post/post.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PostModule,
    MailerModule.forRoot({
      transport: {
        service : "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    OauthModule,
  ],
  // The controllers and providers arrays are optional here, as they are automatically registered by the imported modules.
  controllers: [],
  providers: [],
})
export class AppModule {}
