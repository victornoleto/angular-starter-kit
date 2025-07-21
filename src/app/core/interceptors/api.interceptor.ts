import {
    HttpRequest,
    HttpInterceptorFn,
    HttpHandlerFn,
    HttpParams,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { env } from '../../../env';
import { ActivatedRoute, Router } from '@angular/router';

export const ApiInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
) => {
    //console.debug('Api Http Interceptor: intercepting request', req);

    const authService = inject(AuthService);
    const activatedRoute = inject(ActivatedRoute);
    const router = inject(Router);

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

    const method = modifiedReq.method.toUpperCase();

    if (method === 'GET') {

        // Converter query de pascalCase para snake_case
        const params = new URLSearchParams(modifiedReq.params.toString());
        const snakeCaseParams: { [key: string]: string } = {};
        params.forEach((value, key) => {
            if (value) {
                const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
                snakeCaseParams[snakeCaseKey] = value;
            }
        });

        modifiedReq = modifiedReq.clone({
            params: new HttpParams({
                fromObject: snakeCaseParams
            }),
        });

        /**
         * Adicionar query string à URL
         * Esse if valida que isso só será feito em uma "url principal", e não para todos os GETs
         * Exemplos: 
         * - Adicionar a query na página /users quando fizermos a consulta para /api/users
         * - Não adicionar a query na página /users quando fizermos a consulta para /api/groups
         */
        /* if (modifiedReq.url.endsWith(window.location.pathname)) {
            router.navigate([], {
                relativeTo: activatedRoute,
                queryParams: snakeCaseParams,
                queryParamsHandling: 'replace',
                replaceUrl: true,
            });
        } */

    } else {

        // Para métodos não-GET, carregar CSRF e adicionar X-XSRF-TOKEN
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

    // Requisição GET: segue direto
    return next(modifiedReq);
};
