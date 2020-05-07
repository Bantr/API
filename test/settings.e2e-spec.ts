import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import * as request from 'supertest';

import { AuthenticatedGuard } from '../src/auth/guards/authenticated.guard';
import { AppModule } from './../src/app.module';

dotenv.config();

describe('SettingsController (e2e)', () => {
    let app;
    const authGuard = { canActivate: () => true };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideGuard(AuthenticatedGuard).useValue(authGuard)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('/notification/platform (POST)', () => {
        it('Returns 201 when correct data is provided', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/platform')
                .send({ platform: 0, status: true })
                .expect(201);
        });

        it('Returns 400 when no type is provided', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/platform')
                .send({ status: true })
                .expect(400);
        });

        it('Returns 400 when an invalid type is provided - string', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/platform')
                .send({ platform: "this is not a real ban type" })
                .expect(400);
        });

        it('Returns 400 when an invalid type is provided - unknown type', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/platform')
                .send({ platform: 13333333333333337 })
                .expect(400);
        });

        it('Returns 400 when type is provided as a string', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/platform')
                .send({ platform: "0" })
                .expect(400);
        });


        it('Returns 400 when an invalid status is provided', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/platform')
                .send({ status: "this is not a real status"})
                .expect(400);
        });
    });

    describe('/notification/bantype (POST)', () => {

        it('Returns 201 when correct data is provided', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/bantype')
                .send({ type: 0, status: true })
                .expect(201);
        });

        it('Returns 400 when no type is provided', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/bantype')
                .send({ status: true })
                .expect(400);
        });

        it('Returns 400 when an invalid type is provided - string', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/bantype')
                .send({ type: "this is not a real ban type" })
                .expect(400);
        });

        it('Returns 400 when an invalid type is provided - unknown type', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/bantype')
                .send({ type: 13333333333333337 })
                .expect(400);
        });

        it('Returns 400 when type is provided as a string', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/bantype')
                .send({ type: "0" })
                .expect(400);
        });


        it('Returns 400 when an invalid status is provided', () => {
            return request(app.getHttpServer())
                .post('/settings/notification/bantype')
                .send({ status: "this is not a real status"})
                .expect(400);
        });
    });


    afterAll(async () => {
        await app.close();
    });
});
