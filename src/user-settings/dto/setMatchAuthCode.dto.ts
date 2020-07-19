import { IsString, Matches } from 'class-validator';

export class SetMatchAuthCodeDTO {
  @IsString()
  @Matches(/\w{4}-\w{5}-\w{4}/)
  authCode: string;
}
