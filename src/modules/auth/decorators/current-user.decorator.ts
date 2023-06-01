import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom decorator to inject user into execution context
const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext) => {
    const [req] = context.getArgs();
    return req?.user;
  },
);

export default CurrentUser;
