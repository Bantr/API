import { Body, Controller, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/get-user.decorator';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import User from '../user/user.entity';
import { NotificationRepository } from './notification.repository';
import Notification from './notifications.entity';
import { SetSeenDto } from './setSeen.dto';

/**
 * General app controller
 */
@UseGuards(AuthenticatedGuard)
@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {

    constructor(private notificationRepository: NotificationRepository) { }

    @Post('/seen')
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    async setSeen(@Body() { status, ids }: SetSeenDto, @GetUser() user: User): Promise<Notification[]> {

        const changedNotifications: Promise<Notification>[] = [];
        for (const id of ids) {
            const notification = await this.notificationRepository.findOne({ where: { id, user: { id: user.id } } });

            if (!notification) {
                throw new NotFoundException();
            }
            notification.seen = status;
            changedNotifications.push(notification.save());

        }


        return Promise.all(changedNotifications);

    }

    @Post('/:id/delete')
    @ApiNotFoundResponse()
    async delete(@Param('id') id: string, @GetUser() user: User): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({ where: { id, user: { id: user.id } } });

        if (!notification) {
            throw new NotFoundException();
        }

        notification.deleted = true;
        return notification.save();

    }
}
