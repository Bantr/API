import { INotificationType } from '@bantr/lib/dist/types/';
import { IsBoolean, Min } from 'class-validator';

export class SetNotificationTypeDto {
    @Min(0)
    platform: INotificationType;

    @IsBoolean()
    status: boolean;
}