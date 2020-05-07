import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as flash from 'connect-flash';
import * as connect from 'connect-redis';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';
import * as readJson from 'read-package-json';
import { createClient } from 'redis';
import { promisify } from 'util';

import { AppModule } from './app.module';
import { SentryInterceptor } from './sentry.interceptor';

dotenv.config();

const readJsonPromise = promisify(readJson);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const morgan = require('morgan'); // imports are weird

/**
 * Logger
 */
const logger = new Logger('bootstrap');

const RedisStore = connect(session);


if (process.env.BANTR_SENTRY_DSN) {
  logger.log(`Sentry error tracking enabled.`);
  Sentry.init({ dsn: process.env.BANTR_SENTRY_DSN });
}

async function setUpSwagger(app: NestExpressApplication) {
  const pkg = await readJsonPromise('./package.json');
  const options = new DocumentBuilder()
    .setTitle('Bantr')
    .setDescription('Bantr web API documentation')
    .setVersion(pkg.version)
    .addTag('Authentication')
    .addTag('Settings')
    .addTag('Notifications')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  return app;
}

/**
 * Start the application
 */
async function bootstrap() {
  const redisClient = createClient({
    port: parseInt(process.env.REDIS_PORT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10),
    prefix: process.env.REDIS_PREFIX
  });

  let app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ credentials: true, origin: true });
  app.set('trust proxy', 'loopback,uniquelocal');

  if (process.env.NODE_ENV === 'production') {
    // Standard Apache combined log output.
    // :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
    app.use(morgan('combined'));
  } else {
    // :method :url :status :response-time ms - :res[content-length]
    app.use(morgan('dev'));
  }

  app.use(
    session({
      store: new RedisStore({
        port: parseInt(process.env.REDIS_PORT, 10),
        host: process.env.REDIS_HOST,
        pass: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB, 10),
        client: redisClient
      }),
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SentryInterceptor());

  app = await setUpSwagger(app);

  await app.listen(process.env.PORT);
  logger.log(`Application listening on port ${process.env.PORT}`);

  process.on('unhandledRejection', e => {
    logger.error(`Unhandled Promise rejection! ${e}`);
    throw e;
  });
}

bootstrap();


