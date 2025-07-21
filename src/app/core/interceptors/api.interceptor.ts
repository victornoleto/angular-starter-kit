import {
    HttpRequest,
    HttpInterceptorFn,
    HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { env } from '../../../env';

export const ApiInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
) => {
    //console.debug('Api Http Interceptor: intercepting request', req);

    const authService = inject(AuthService);

    let modifiedReq = req.clone({
        setHeaders: {
            Referer: env.referer,
        },
        withCredentials: true,
    });

    if (!req.headers.has('Accept')) {
        modifiedReq = modifiedReq.clone({
            setHeaders: {
                Accept: 'application/json',
            },
        });
    }

    // Para métodos não-GET, carregar CSRF e adicionar X-XSRF-TOKEN
    if (req.method.toUpperCase() !== 'GET') {
        return from(authService.sanctumCsrf()).pipe(
            switchMap((token: string | null) => {
                if (token) {
                    modifiedReq = modifiedReq.clone({
                        setHeaders: {
                            'X-XSRF-TOKEN': token,
                        },
                    });
                }
                return next(modifiedReq);
            }),
        );
    }

    console.log('Api Http Interceptor: skipping CSRF for GET request', req.url);

    // Requisição GET: segue direto
    return next(modifiedReq);
};
