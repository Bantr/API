import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FaceitGuard extends AuthGuard('faceit') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        // If a parameter redirectTo exists, save it in the session
        // So that we can redirect the user back after auth
        if (request.query.redirectTo) {
            request.session.redirectTo = request.query.redirectTo;
        }
        const result = (await super.canActivate(context)) as boolean;
        await super.logIn(request);
        return result;
    }
}
