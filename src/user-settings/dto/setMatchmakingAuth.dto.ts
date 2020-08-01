import { IsString, Matches } from 'class-validator';

export class SetMatchmakingAuthDTO {
  @IsString()
  @Matches(/CSGO-\w{5}-\w{5}-\w{5}-\w{5}-\w{5}/)
  lastKnownMatch: string;
  @IsString()
  @Matches(/\w{4}-\w{5}-\w{4}/)
  matchmakingAuthCode: string;
}
