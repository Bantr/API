import { IBanType } from '@bantr/lib/dist/types/BanType.enum';
import { IsBoolean } from 'class-validator';

export class SetBanTypeDto {
    type: IBanType;

    @IsBoolean()
    status: boolean;
}