import { IBanType } from '@bantr/lib/dist/types/BanType.enum';
import { IsBoolean, Min } from 'class-validator';

export class SetBanTypeDto {
    @Min(0)
    type: IBanType;

    @IsBoolean()
    status: boolean;
}