import { User, UserSettings } from '@bantr/lib/dist/entities';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { GetUser } from '../auth/get-user.decorator';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { SetBanTypeDto } from './dto/setBanType.dto';
import { SetLastKnownMatchDTO } from './dto/setLastKnownMatch.dto';
import { SetMatchAuthCodeDTO } from './dto/setMatchAuthCode.dto';
import { SetNotificationTypeDto } from './dto/setNotificationType.dto';
import { UserSettingsService } from './user-settings.service';

/**
 * General app controller
 */
@UseGuards(AuthenticatedGuard)
@ApiTags("Settings")
@Controller("settings")
export class SettingsController {
  constructor(private settingsService: UserSettingsService) {}

  @Post("/notification/bantype")
  async setBanType(
    @Body() setBanType: SetBanTypeDto,
    @GetUser() user: User
  ): Promise<QueryDeepPartialEntity<UserSettings>> {
    return this.settingsService.setBanType(setBanType, user);
  }

  @Post("/notification/platform")
  async setNotificationType(
    @Body() setNotificationType: SetNotificationTypeDto,
    @GetUser() user: User
  ) {
    return this.settingsService.setNotificationType(setNotificationType, user);
  }

  @Post("/steam/matchAuthCode")
  async setMatchAuthCode(
    @Body() setMatchAuthCodeDto: SetMatchAuthCodeDTO,
    @GetUser() user: User
  ) {
    return this.settingsService.setMatchAuthCode(setMatchAuthCodeDto, user);
  }

  @Post("/steam/lastKnownMatch")
  async setLastKnownMatch(
    @Body() setLastKnownMatchDTO: SetLastKnownMatchDTO,
    @GetUser() user: User
  ) {
    return this.settingsService.setLastKnownCode(setLastKnownMatchDTO, user);
  }
}
