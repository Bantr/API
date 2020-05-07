import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';

import { ConfigService } from '../config/config.service';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { ISessionInterface } from './session.interface';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            returnURL: `${configService.get('HOSTNAME')}/auth/steam/return`,
            realm: configService.get('HOSTNAME'),
            apiKey: configService.get('BANTR_STEAM_API')
        });
    }

    async validate(identifier, profile): Promise<ISessionInterface> {
        const userSession = await this.userRepository.signUp({
            steamId: profile._json.steamid,
            username: profile._json.personaname
        });

        const session = {
            id: userSession.id,
            username: userSession.username,
            steamId: userSession.steamId,
            faceitId: userSession.faceitId,
            discordId: userSession.discordId,
            graphQLKey: '',
            steamUsername: profile._json.personaname,
            steamAvatar: profile._json.avatarfull,
            steamProfile: profile._json.profileurl
        };

        session.graphQLKey = await this.authService.getGraphQLAuthKey(session);
        return session;
    }
}
