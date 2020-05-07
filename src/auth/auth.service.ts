import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import User from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

/**
 * Authentication service
 */
@Injectable()
export class AuthService {
    /**
     * The logger
     */
    private logger = new Logger('AuthService');

    /**
     * Inject dependencies
     * @param userRepository
     */
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) { }

    /**
     * Removes the link between a User and a service
     * @param user User
     * @param service The service to disconnect
     */
    async disconnectService(user: User, service: SupportedServices): Promise<User> {
        let userRecord = new User();
        userRecord = Object.assign(userRecord, user);
        userRecord[service] = null;
        return userRecord.save();
    }

    async getGraphQLAuthKey(session): Promise<string> {
        const jwt = await this.jwtService.signAsync(session);
        return jwt;
    }

    getGraphQLKeyPayload(key: string): string | { [key: string]: unknown } {
        const payload = this.jwtService.decode(key);
        return payload;
    }

    async validateGraphQLKey(key: string): Promise<{ id: string }> {
        return this.jwtService.verifyAsync(key);
    }

    async getUserRole(id: string): Promise<string> {
        const user = await this.userRepository.findOneOrFail(id);
        return user.role;
    }
}

export enum SupportedServices {
    faceit = 'faceitId',
    discord = 'discordId',
}