import { User, UserSettings } from '@bantr/lib/dist/entities';
import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { GetUser } from '../auth/get-user.decorator';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { SetBanTypeDto } from './dto/setBanType.dto';
import { SetMatchmakingAuthDTO } from './dto/setMatchmakingAuth.dto';
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

  @Post("/steam/matchmakingauth")
  async setMatchmakingAuth(
    @Body() dto: SetMatchmakingAuthDTO,
    @GetUser() user: User
  ) {
    const isValid = await this.settingsService.validateMatchmakingAuth(
      dto,
      user
    );

    if (!isValid) {
      throw new BadRequestException(
        "Invalid steam matchmaking authentication info"
      );
    }

    return this.settingsService.setMatchmakingAuth(dto, user);
  }
}
