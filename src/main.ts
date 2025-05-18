import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Sentry.init({
    dsn: '',
    tracesSampleRate: 1.0, //성능 측정(0~1사이)
    profileSessionSampleRate: 1.0, // 프로파일링 샘플 비율
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
