import Joi = require('@hapi/joi');
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { UserModule } from './user/user.module';

dotenv.config();

const isTest = process.env.BANTR_IS_TEST;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
      NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
      PORT: Joi.number().default(3000),
      BANTR_PG_USER: Joi.string().required(),
      BANTR_PG_PW: Joi.string().required(),
      BANTR_PG_DB: Joi.string().required(),
      BANTR_PG_HOST: Joi.string().default('localhost'),
      BANTR_PG_PORT: Joi.number().default(5432),
      BANTR_JWT_SECRET: Joi.string().required(),
      BANTR_STEAM_API: Joi.string().required(),
      BANTR_DISCORD_CLIENTID: Joi.string().required(),
      BANTR_DISCORD_CLIENTSECRET: Joi.string().required(),
      BANTR_FACEIT_CLIENTID: Joi.string().required(),
      BANTR_FACEIT_CLIENTSECRET: Joi.string().required(),
      REDIS_PORT: Joi.number().default(6379),
      REDIS_HOST: Joi.string().default('localhost'),
      REDIS_PASSWORD: Joi.string().allow(''),
      REDIS_PREFIX: Joi.string().default('bantr'),
      REDIS_DB: Joi.number().default(0),
      HOSTNAME: Joi.string().default('http://localhost:3000'),
      BANTR_SENTRY_DSN: Joi.string().default(''),
      BANTR_IS_TEST: Joi.boolean().default(false)
  })
}),
    TypeOrmModule.forRoot({
      // TODO: Handle this config via config service
      type: "postgres",
      host: process.env.BANTR_PG_HOST,
      port: parseInt(process.env.BANTR_PG_PORT, 10),
      username: process.env.BANTR_PG_USER,
      password: process.env.BANTR_PG_PW,
      database: process.env.BANTR_PG_DB,
      entities: [
        __dirname + "/../node_modules/@bantr/lib/**/*.entity{.ts,.js}"
      ],
      synchronize: isTest ? true : false
    }),
    AuthModule,
    UserModule,
    UserSettingsModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [ConfigService]
})
export class AppModule {}
