import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsDateString, IsNumber, IsOptional } from 'class-validator';

import User from '../../user/user.entity';

export class GetPlayersFilterDto {
    user: User;

    @IsDateString()
    createdAtBefore: Date;

    @IsDateString()
    createdAtAfter: Date;

    @IsBoolean()
    @IsOptional()
    @Transform(hasBan => JSON.parse(hasBan))
    hasBan?: boolean;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    banDetectedBefore?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    banDetectedAfter?: Date;

    @IsOptional()
    @IsNumber()
    @Transform(limit => JSON.parse(limit))
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Transform(skip => JSON.parse(skip))
    skip?: number;
}
