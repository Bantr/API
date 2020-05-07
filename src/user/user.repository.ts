import { InternalServerErrorException, Logger } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { ISessionInterface } from 'src/auth/session.interface';
import { EntityRepository, IsNull, Not, Repository } from 'typeorm';

import UserSettings from '../user-settings/user-settings.entity';
import User from './user.entity';


/**
 * Database operations for User
 */
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    /**
     * The logger, duh :)
     */
    private logger = new Logger('UserRepository');
    /**
     * Register a user, hashes password with salt
     * @param authCredentialsDto
     */
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<ISessionInterface> {
        const { username, steamId } = authCredentialsDto;

        const user = new User();
        user.username = username;
        user.steamId = steamId;

        try {
            user.settings = new UserSettings();
            await user.save();
            await user.settings.save();
            this.logger.debug(`New user signed up with username ${username}`);
            return {
                username,
                id: user.id,
                steamId,
                faceitId: user.faceitId,
                discordId: user.discordId
            };
        } catch (error) {
            if (error.code === '23505') { // Duplicate steamId
                const createdUser = await User.findOne({ where: { steamId } });
                return {
                    id: createdUser.id, username,
                    steamId,
                    faceitId: createdUser.faceitId,
                    discordId: createdUser.discordId
                };
            } else {
                this.logger.error(`Failed to signup user ${user.username}`, error.stack);
                throw new InternalServerErrorException();
            }
        }
    }

    async linkDiscordUser(userId: string, discordId: string) {
        await this.update(userId, { discordId });
        const user = await this.findOne(userId);

        return user;
    }

    async linkFaceitUser(userId: string, faceitId: string, faceitName: string) {
        await this.update(userId, { faceitId, faceitName });
        const user = await this.findOne(userId);

        return user;
    }

    /**
     * Get users who have linked their Faceit account
     */
    async getUsersWithFaceIt(): Promise<User[]> {
        const users = await this.find({ where: { faceitId: Not(IsNull()) }, select: ['faceitId', 'username'] });
        return users;
    }

    async findPlayers(user: User) {
        const response = await this.findOne(
            {
                relations: ['tracks'],
                where: {
                    id: user.id
                }
            }
        );

        return response.tracks;
    }

    async getSettings(user: User) {
        return this.findOne(user.id, { relations: ['settings'] });
    }

}
