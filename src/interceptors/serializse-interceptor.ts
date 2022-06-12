import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export function Serialize<T, V>(dto: T) {
    return UseInterceptors(new SerializeInterceptor<V>(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> | Promise<Observable<any>> {
    return next.handle().pipe(
        map(data => plainToClass(this.dto, data, { excludeExtraneousValues: true }))
    );
  }
}
