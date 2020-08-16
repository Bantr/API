import { User } from '@bantr/lib/dist/entities';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to get User from a request
 */
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const isTest = process.env.BANTR_IS_TEST === "true";

    if (isTest) {
      const user = new User();
      user.id = 1;
      return user;
    }

    const request = ctx.switchToHttp().getRequest();
    const user = request.session.passport.user;

    if (user) {
      const record = new User();
      Object.assign(record, user);
      record.lastActive = new Date();
      record.save();
    }

    return data ? user && user[data] : user;
  }
);
