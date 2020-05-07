import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import User from '../user/user.entity';

/**
 * User service
 */
@Injectable()
export class UserService {
    /**
     * Inject dependencies
     * @param userRepository
     */
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) { }

    public async getSettings(user: User) {
        const userRecord = await this.userRepository.getSettings(user);
        return userRecord.settings;
    }
}
