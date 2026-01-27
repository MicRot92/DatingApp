import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { BusyService } from '../services/busy-service';
import { delay, of, tap } from 'rxjs';


const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if (req.method === 'GET') {
    const cachedResponse = cache.get(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse);
    }
    busyService.busy();
  }
  return next(req).pipe(
    delay(2000),
    tap(response => {
      cache.set(req.urlWithParams, response);
    }),
    finalize(() => busyService.idle())
  );
};
