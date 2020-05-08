import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DiscordStrategy } from './discord.strategy';
import { FaceitStrategy } from './faceit.strategy';
import { SessionSerializer } from './session.serializer';
import { SteamStrategy } from './steam.strategy';

dotenv.config();

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'steam',
      session: true
    }),
    TypeOrmModule.forFeature([UserRepository]),
    HttpModule,
    JwtModule.register({ secret: process.env.BANTR_JWT_SECRET })
  ],
  controllers: [AuthController],
  providers: [AuthService,
    SessionSerializer,
    SteamStrategy,
    DiscordStrategy,
    FaceitStrategy],
  exports: [
    PassportModule
  ]
})
export class AuthModule { }
