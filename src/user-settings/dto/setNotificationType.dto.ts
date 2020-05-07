import { INotificationType } from '@bantr/lib/dist/types/';
import { IsBoolean } from 'class-validator';

export class SetNotificationTypeDto {
    platform: INotificationType;

    @IsBoolean()
    status: boolean;
}