import { Routes } from '@angular/router';
import { authGuard } from '../../core/middlewares';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('../../core/layout/auth/auth.component').then(
                (c) => c.AuthComponent,
            ),
        children: [{}],
    },
];
