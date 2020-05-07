import { MinLength, IsString, MaxLength, Matches } from 'class-validator';

/**
 * DTO for auth credentials
 */
export class AuthCredentialsDto {

    // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i checks if this is a valid email
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/[A-Za-z0-9_-]/)
    username: string;

    @IsString()
    @MinLength(17)
    @MaxLength(17)
    steamId: string;
}
