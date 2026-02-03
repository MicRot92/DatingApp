import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { BusyService } from '../services/busy-service';
import { delay, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params.keys()
      .map(key => `${key}=${params.getAll(key)?.join(',')}`)
      .join('&');
    return `${url}?${paramString}`;
  }

  const invalidateCache = (url: string) => {
    for (const key of cache.keys()) {
      console.log(`Cache has key: ${key} for invalidation check against URL: ${url}`);
      if (key.includes(url)) {
        cache.delete(key);
        console.log(`Cache invalidated for key: ${key}`);
      }
    }
  }

  const cacheKey = generateCacheKey(req.url, req.params);

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' && req.url.includes('/likes ')) {
    invalidateCache('/likes');
  }

  if (req.method === 'GET') {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

  }

  busyService.busy();
  return next(req).pipe(
    delay(2000),
    tap(response => {
      cache.set(cacheKey, response);
    }),
    finalize(() => busyService.idle())
  );
};
