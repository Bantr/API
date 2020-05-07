import { EntityRepository, Repository } from 'typeorm';

import Notification from './notifications.entity';



@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
}