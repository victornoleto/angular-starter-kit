import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { AuthService } from './core/auth/services/auth.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
            withFetch(),
            withInterceptors([ApiInterceptor])
        ),
        provideAppInitializer(async () => {
            return (inject(AuthService)).isAuthenticated();
        })
    ],
};
