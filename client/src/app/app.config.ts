import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InitService } from '../core/services/init-service';
import { lastValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(async () => {
      // You can add any initialization logic here if needed in the future
      const initService = inject(InitService);



      return new Promise<void>((resolve) => {
        setTimeout(() => {

          try {
            lastValueFrom(initService.init());
          } finally {
            const splash = document.getElementById('splash-screen');
            if (splash) {
              splash.remove();
            }
          }
          resolve();
        }, 500);
      });
    })
  ]
};
