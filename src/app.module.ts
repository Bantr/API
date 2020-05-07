import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';
import { NotificationsModule } from './notifications/notifications.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { UserModule } from './user/user.module';

// Does not happen in config service because it's a PITA to parse the values from the service inside module initialization
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BANTR_PG_HOST,
      port: parseInt(process.env.BANTR_PG_PORT, 10),
      username: process.env.BANTR_PG_USER,
      password: process.env.BANTR_PG_PW,
      database: process.env.BANTR_PG_DB,
      entities: [__dirname + "/../node_modules/@bantr/lib/**/*.entity{.ts,.js}"],
      synchronize: false
    }),
    AuthModule,
    UserModule,
    UserSettingsModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [ConfigService]
})
export class AppModule { }
