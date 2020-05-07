import * as Joi from '@hapi/joi';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

/**
 * .env config
 */
export interface IEnvConfig {
    [key: string]: string
}

/**
 * Handle configuration values
 */
export class ConfigService {

    logger = new Logger('ConfigService');
    /**
     * Holds the env config
     */
    private envConfig: IEnvConfig;

    /**
     * Reads the .env file
     * @param filePath
     */
    constructor(filePath: string) {
        let config;
        this.envConfig = {};
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath);
            config = dotenv.parse(data);
            this.envConfig = this.validateInput(config);
        }
    }

    /**
     * Ensures all needed variables are set, and returns the validated JavaScript object
     * including the applied default values.
     * @param envConfig
     */
    private validateInput(envConfig: IEnvConfig): IEnvConfig {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            NODE_ENV: Joi.string()
                .valid('development', 'production', 'test')
                .default('development'),
            PORT: Joi.number().default(3000),
            BANTR_PG_USER: Joi.string().required(),
            BANTR_PG_PW: Joi.string().required(),
            BANTR_PG_DB: Joi.string().required(),
            BANTR_PG_HOST: Joi.string().default('localhost'),
            BANTR_PG_PORT: Joi.number().default(5432),
            JWT_SECRET: Joi.string().required(),
            BANTR_STEAM_API: Joi.string().required(),
            BANTR_DISCORD_CLIENTID: Joi.string().required(),
            BANTR_DISCORD_CLIENTSECRET: Joi.string().required(),
            BANTR_FACEIT_CLIENTID: Joi.string().required(),
            BANTR_FACEIT_CLIENTSECRET: Joi.string().required(),
            REDIS_PORT: Joi.number().default(6379),
            REDIS_HOST: Joi.string().default('localhost'),
            REDIS_PASSWORD: Joi.string().allow(''),
            REDIS_PREFIX: Joi.string().default('bantr'),
            REDIS_DB: Joi.number().default(0),
            HOSTNAME: Joi.string().default('http://localhost:3000'),
            BANTR_SENTRY_DSN: Joi.string().default(''),
            BANTR_IS_TEST: Joi.boolean().default(false)
        });

        const { error, value: validatedEnvConfig } = envVarsSchema.validate(
            envConfig
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }

    /**
     * Get a config value
     * @param key
     */
    get(key: string): string {
        if (this.envConfig[key]) {
            return this.envConfig[key];

        } else {
            throw new Error(`${key} was not found in configuration!`);
        }
    }
}
