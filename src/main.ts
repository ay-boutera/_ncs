import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appValidationPipe } from './common/pipes/validation.pipe';
import { sessionMiddleware } from './common/middleware/exp_session.middleware';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { configurePassportSession } from './common/middleware/passport-session.middleware';

async function bootstrap() {
  configurePassportSession(); // Set up passport session serialization
  const app = await NestFactory.create(AppModule);
  // Enable global validation pipe
  app.useGlobalPipes(appValidationPipe);
  app.use(cookieParser());
  app.use(sessionMiddleware());
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
