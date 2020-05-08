import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';

import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { ISessionInterface } from './session.interface';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            passReqToCallback: true,
            clientID: configService.get('BANTR_DISCORD_CLIENTID'),
            clientSecret: configService.get('BANTR_DISCORD_CLIENTSECRET'),
            callbackURL: `${configService.get('HOSTNAME')}/auth/discord/return`,
            scope: ['identify']
        });
    }

    async validate(req, accessToken, refreshToken, profile): Promise<ISessionInterface> {
        const { id,
            steamId,
            username,
            steamUsername,
            steamAvatar,
            steamProfile } = req.session.passport.user;
        const user = await this.userRepository.linkDiscordUser(id, profile.id);


        const session = {
            id,
            steamId,
            username,
            discordId: profile.id,
            faceitId: user.faceitId,
            graphQLKey: '',
            steamUsername,
            steamAvatar,
            steamProfile
        };

        session.graphQLKey = await this.authService.getGraphQLAuthKey(session);

        return session;
    }
}
