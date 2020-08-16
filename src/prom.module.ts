import { entities } from '@bantr/lib/dist/entities';
import { PromModule } from '@digikare/nestjs-prom';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Request, Response } from 'express';
import * as client from 'prom-client';

/**
 * Keeps track of all the gauges related to entities
 */
const entityGauges: Array<[client.Gauge<string>, string]> = [];

/**
 * Middleware that checks if a secret key is present in headers
 * @param req
 * @param res
 * @param next
 */
export const promAuthMiddleware = (req: Request, res: Response, next) => {
  if (
    req.headers["x-bantr-metrics-auth"] === process.env.BANTR_METRICS_SECRET
  ) {
    return next();
  } else {
    return res.status(403).send("Forbidden").end();
  }
};

/**
 * Creates all custom gauges, counters, ... to be used in prom-client
 */
function setUp() {
  // Total count for all database entities
  for (const entity of entities) {
    entityGauges.push([
      new client.Gauge({
        name: entity.name,
        help: `Total number of ${entity.name}`
      }),
      entity.name
    ]);
  }
}

/**
 * Middleware function that collects all data for custom metrics
 * @param req
 * @param res
 * @param next
 */
async function collectData(req, res, next) {
  // TODO: prom-client Async collect function is not released yet
  // https://github.com/siimon/prom-client/issues/383
  // Once this is released, we should refactor this to module
  for (const entityGauge of entityGauges) {
    const entity = entities.find((_) => _.name === entityGauge[1]);
    entityGauge[0].set(await entity.count());
  }
  return next();
}

@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: "Bantr_API",
        version: require("../package.json").version
      }
    })
  ]
})
export class PrometheusModule implements NestModule {
  constructor() {
    setUp();
  }
  /**
   * Apply middleware functions
   * @param consumer
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(promAuthMiddleware).forRoutes("/metrics");
    consumer.apply(collectData).forRoutes("/metrics");
  }
}
