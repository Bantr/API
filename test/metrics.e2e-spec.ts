import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe("Prometheus metrics (e2e)", () => {
  let app;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    dotenv.config();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("/metrics (GET)", () => {
    it("Returns 200 when correct info is given", () => {
      return request(app.getHttpServer())
        .get("/metrics")
        .set("x-bantr-metrics-auth", process.env.BANTR_METRICS_SECRET)
        .expect(200);
    });

    it("Returns 403 when no auth header is set", () => {
      return request(app.getHttpServer()).get("/metrics").expect(403);
    });
  });
});
