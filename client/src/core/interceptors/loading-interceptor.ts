import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { BusyService } from '../services/busy-service';
import { delay, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  busyService.busy();
  return next(req).pipe(
    // Remove delay for now - add it back later if needed
    // delay(2000),
    // Remove caching - it's interfering with pagination
    // tap(response => {
    //   cache.set(req.urlWithParams, response);
    // }),
    finalize(() => busyService.idle())
  );
};
