import { User, UserSettings } from '@bantr/lib/dist/entities';
import { INotificationType } from '@bantr/lib/dist/types';
import { IBanType } from '@bantr/lib/dist/types/BanType.enum';
import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { SetBanTypeDto } from './dto/setBanType.dto';
import { SetMatchmakingAuthDTO } from './dto/setMatchmakingAuth.dto';
import { SetNotificationTypeDto } from './dto/setNotificationType.dto';
import { UserSettingsRepository } from './user-settings.repository';

@Injectable()
export class UserSettingsService {
  /**
   * API key used for authentication with Steam API
   */
  private steamApiKey: string;
  constructor(
    private settingsRepository: UserSettingsRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.steamApiKey = configService.get("BANTR_STEAM_API");
  }

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
    updateObject.matchAuthCode = dto.matchmakingAuthCode;
    updateObject.lastKnownMatch = dto.lastKnownMatch;
    updateObject.matchmakingAuthFailed = false;
    return this.settingsRepository.update(user.id, updateObject);
  }

  public async validateMatchmakingAuth(dto: SetMatchmakingAuthDTO, user: User) {
    if (process.env.BANTR_IS_TEST === "true") {
      return true;
    }

    try {
      await this.httpService
        .get(
          `https://api.steampowered.com/ICSGOPlayers_730/GetNextMatchSharingCode/v1?`,
          {
            params: {
              key: this.steamApiKey,
              steamid: user.steamId,
              knowncode: dto.lastKnownMatch,
              steamidkey: dto.matchmakingAuthCode
            }
          }
        )
        .toPromise();
      return true;
    } catch (e) {
      return false;
    }
  }
}
