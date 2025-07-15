import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/middlewares';

export const routes: Routes = [
    // Rota inicial redireciona para dashboard
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadComponent: () =>
            import('./core/layout/guest/guest.component').then(
                (c) => c.GuestComponent,
            ),
        canActivate: [guestGuard],
        title: 'Autenticação',
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./core/auth/pages/login/login.component').then(
                        (c) => c.LoginComponent,
                    ),
                title: 'Login',
            },
            {
                path: 'register',
                loadComponent: () =>
                    import(
                        './core/auth/pages/register/register.component'
                    ).then((c) => c.RegisterComponent),
                title: 'Registrar',
            },
        ],
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./core/layout/auth/auth.component').then(
                (c) => c.AuthComponent,
            ),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./feature/home/pages/dashboard/dashboard').then(
                        (c) => c.Dashboard,
                    ),
                title: 'Dashboard',
            },
        ],
    },
];
