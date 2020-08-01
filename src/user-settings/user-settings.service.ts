import { User, UserSettings } from '@bantr/lib/dist/entities';
import { INotificationType } from '@bantr/lib/dist/types';
import { IBanType } from '@bantr/lib/dist/types/BanType.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { SetBanTypeDto } from './dto/setBanType.dto';
import { SetMatchmakingAuthDTO } from './dto/setMatchmakingAuth.dto';
import { SetNotificationTypeDto } from './dto/setNotificationType.dto';
import { UserSettingsRepository } from './user-settings.repository';

@Injectable()
export class UserSettingsService {
  constructor(private settingsRepository: UserSettingsRepository) {}

  async setBanType(banTypeChange: SetBanTypeDto, user: User) {
    const { status, type } = banTypeChange;

    let updateObject: QueryPartialEntity<UserSettings> = {};

    switch (type) {
      case IBanType.Community:
        updateObject = { notificationCommunityEnabled: status };
        break;
      case IBanType.Economy:
        updateObject = { notificationEconomyEnabled: status };
        break;
      case IBanType.Faceit:
        updateObject = { notificationFaceitEnabled: status };
        break;
      case IBanType.Game:
        updateObject = { notificationGameEnabled: status };
        break;
      case IBanType.VAC:
        updateObject = { notificationVACEnabled: status };
        break;
      default:
        throw new BadRequestException(`Unknown ban type`);
    }

    await this.settingsRepository.update(user.id, updateObject);
    return updateObject;
  }

  async setNotificationType(
    notificationTypeChange: SetNotificationTypeDto,
    user: User
  ) {
    const { status, platform } = notificationTypeChange;
    let updateObject: QueryPartialEntity<UserSettings> = {};
    switch (platform) {
      case INotificationType.Discord:
        updateObject = { notificationDiscordEnabled: status };
        break;
      default:
        throw new BadRequestException(`Unknown notification type`);
    }

    await this.settingsRepository.update(user.id, updateObject);
    return updateObject;
  }

  async setMatchmakingAuth(dto: SetMatchmakingAuthDTO, user: User) {
    const updateObject: QueryPartialEntity<UserSettings> = {};
    updateObject.matchAuthCode = dto.authCode;
    updateObject.lastKnownMatch = dto.lastKnownMatch;
    return this.settingsRepository.update(user.id, updateObject);
  }
}
