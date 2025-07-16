import { Routes } from "@angular/router";
import { guestGuard } from "../middlewares";

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () =>
            import('../layout/guest/guest.component').then(
            (c) => c.GuestComponent,
        ),
        canActivate: [guestGuard],
        title: 'Autenticação',
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/login/login.component').then(
                    (c) => c.LoginComponent,
                ),
                title: 'Login',
            },
            {
                path: 'register',
                loadComponent: () =>
                    import(
                    './pages/register/register.component'
                ).then((c) => c.RegisterComponent),
                title: 'Registrar',
            },
        ],
    }
];