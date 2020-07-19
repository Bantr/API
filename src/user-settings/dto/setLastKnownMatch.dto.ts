import { IsString, Matches } from 'class-validator';

export class SetLastKnownMatchDTO {
  @IsString()
  @Matches(/CSGO-\w{5}-\w{5}-\w{5}-\w{5}-\w{5}/)
  lastKnownMatch: string;
}
