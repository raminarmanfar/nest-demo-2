import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: never, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().currentUser;
    }
); 