import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import Notification from './notifications.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, NotificationRepository])
    ],
    controllers: [NotificationController]
})
export class NotificationsModule { }
