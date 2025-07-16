import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: () => import('./core/auth/auth.routes').then(m => m.routes),
    },
    {
        path: '',
        loadChildren: () => import('./feature/home/home.routes').then(m => m.routes),
    },
    {
        path: '',
        loadChildren: () => import('./feature/users/users.routes').then(m => m.routes),
    }
];
