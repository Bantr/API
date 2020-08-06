import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import * as request from 'supertest';

import { AuthService } from '../src/auth/auth.service';
import { AppModule } from './../src/app.module';

const expectAnonymous = (res: Response) => {
  expect(res.body).toHaveProperty("X-Hasura-Role");
  expect(res.body["X-Hasura-Role"]).toBe("anonymous");
};

const authService = {
  validateGraphQLKey: jest.fn()
};

describe("authController (e2e)", () => {
  let app;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    dotenv.config();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("/auth/graphql (POST)", () => {
    it("Returns 200 when correct info is given", () => {
      authService.validateGraphQLKey.mockReturnValue({ id: 1 });
      return request(app.getHttpServer())
        .post("/auth/graphql")
        .send({ headers: { "bantr-graphql": "somethingValid" } })
        .expect((res: Response) => {
          expect(res.body).toHaveProperty("X-Hasura-Role");
          expect(res.body["X-Hasura-Role"]).toBe("user");
          expect(res.body).toHaveProperty("X-Hasura-User-Id");
          expect(res.body["X-Hasura-User-Id"]).toBe("1");
        })
        .expect(() => {
          expect(authService.validateGraphQLKey).toBeCalledTimes(1);
        })
        .expect(200);
    });
    it("Returns anonymous when no header is given", () => {
      return request(app.getHttpServer())
        .post("/auth/graphql")
        .send({ headers: {} })
        .expect(expectAnonymous)
        .expect(() => {
          expect(authService.validateGraphQLKey).not.toBeCalled;
        })
        .expect(200);
    });

    it("Returns 401 when invalid key is given", () => {
      authService.validateGraphQLKey.mockReturnValue(false);
      return request(app.getHttpServer())
        .post("/auth/graphql")
        .send({ headers: { "bantr-graphql": "idksomethinginvalid" } })
        .expect(() => {
          expect(authService.validateGraphQLKey).toBeCalledTimes(1);
        })
        .expect(401);
    });
  });
});
