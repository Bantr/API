import { EntityRepository, Repository } from 'typeorm';

import UserSettings from './user-settings.entity';



@EntityRepository(UserSettings)
export class UserSettingsRepository extends Repository<UserSettings> {
}