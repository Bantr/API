import { constants } from '@bantr/lib';
import { IsString, Matches } from 'class-validator';

export class SetMatchmakingAuthDTO {
  @IsString()
  @Matches(constants.lastKnownMatch)
  lastKnownMatch: string;
  @IsString()
  @Matches(constants.matchAuthCode)
  matchmakingAuthCode: string;
}
