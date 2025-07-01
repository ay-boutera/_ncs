import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { OauthModule } from './oauth/oauth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './models/user/user.module';
import { WasteTypeModule } from './models/waste-type/waste-type.module';
import { CollectionPointModule } from './models/collection-point/collection-point.module';
import { PartnerModule } from './models/partner/partner.module';

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
    WasteTypeModule,
    CollectionPointModule,
    PartnerModule,
  ],
  // The controllers and providers arrays are optional here, as they are automatically registered by the imported modules.
  controllers: [],
  providers: [],
})
export class AppModule {}
