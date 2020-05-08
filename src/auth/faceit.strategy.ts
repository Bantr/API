/* eslint-disable */
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { ISessionInterface } from './session.interface';


// TODO: This pile of garbage is deprecated and will be removed soon

// tslint:disable-next-line:no-var-requires
const OAuth2Strategy = require('passport-oauth2'); // import doesn't work here... idk


/**
 * `Strategy` constructor.
 *
 * Options:
 *   - `clientID`      your FACEIT application's client id
 *   - `clientSecret`  your FACEIT application's client secret
 *   - `callbackURL`   URL to which FACEIT will redirect the user after granting authorization
 *
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */

class Strategy extends OAuth2Strategy {

    name: string;
    authorizationParams: any;
    _oauth2: any;

    constructor(options, verify) {
        options = options || {};
        options.authorizationURL = options.authorizationURL || 'https://cdn.faceit.com/widgets/sso/index.html';
        options.tokenURL = options.tokenURL || 'https://api.faceit.com/auth/v1/oauth/token';

        super(options, verify);
        OAuth2Strategy.call(this, options, verify);
        this.name = 'faceit';

        this._oauth2.setAuthMethod('Basic');
        this._oauth2.useAuthorizationHeaderforGET(true);

        this._oauth2.getOAuthAccessToken = getOAuthAccessToken;
    }

    userProfile(accessToken, done) {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        this._oauth2._request('GET', 'https://api.faceit.com/auth/v1/resources/userinfo', headers, '', accessToken, (err, profile) => {
            if (err) done(err);

            return done(null, JSON.parse(profile));
        });
    }
}

const getOAuthAccessToken = function (code, parameters, callback) {
    const params = parameters || {};
    params.client_id = this._clientId;
    params.client_secret = this._clientSecret;
    params.code = code;
    params.grant_type = 'authorization_code';

    const authData = `${this._clientId}:${this._clientSecret}`;
    const buff = Buffer.from(authData);
    const base64data = buff.toString('base64');

    const postData = require('querystring').stringify(params);

    const postHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64data}`
    };


    this._request('POST', this._getAccessTokenUrl(), postHeaders, postData, null, (error, data, response) => {
        if (error) callback(error);
        else {
            let results;
            results = JSON.parse(data);
            const access_token = results.access_token;
            const refresh_token = results.refresh_token;
            delete results.refresh_token;
            callback(null, access_token, refresh_token, results); // callback results =-=
        }
    });
};

/**
 * Return extra parameters to be included in the authorization request.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = (options) => {
    return {
        redirect_popup: true,
        state: 'faceitStinktBtw'
    };
};


@Injectable()
// tslint:disable-next-line:max-classes-per-file
export class FaceitStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly authService: AuthService
    ) {
        super({
            passReqToCallback: true,
            clientID: configService.get('BANTR_FACEIT_CLIENTID'),
            clientSecret: configService.get('BANTR_FACEIT_CLIENTSECRET'),
            callbackURL: `${configService.get('HOSTNAME')}/auth/faceit/return`,
            scope: ['openid', 'profile']
        });
        this.configService = configService;
    }

    async validate(req, accessToken, refreshToken, profile, done): Promise<ISessionInterface> {
        const { id,
            steamId,
            username,
            steamUsername,
            steamAvatar,
            steamProfile } = req.session.passport.user;
        const user = await this.userRepository.linkFaceitUser(id, profile.guid, profile.nickname);
        const session = {
            id,
            steamId,
            username,
            faceitId: profile.guid,
            discordId: user.discordId,
            graphQLKey: '',
            steamUsername,
            steamAvatar,
            steamProfile
        };

        session.graphQLKey = await this.authService.getGraphQLAuthKey(session);

        return session;

    }
}