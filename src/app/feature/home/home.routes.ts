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
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard').then(
                        (c) => c.Dashboard,
                    ),
                title: 'Dashboard',
            },
            {
                path: 'ui-components',
                loadComponent: () =>
                    import(
                        './pages/ui-components/ui-components.component'
                    ).then((c) => c.UiComponentsComponent),
                title: 'UI Components',
            },
        ],
    },
];
