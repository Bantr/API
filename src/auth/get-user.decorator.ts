import { User } from '@bantr/lib/dist/entities';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to get User from a request
 */
export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const isTest = process.env.BANTR_IS_TEST;

        if (isTest) {
            const user = new User();
            user.id = 1;
            return user;
        }

        const request = ctx.switchToHttp().getRequest();
        const user = request.session.passport.user;

        return data ? user && user[data] : user;
    });
