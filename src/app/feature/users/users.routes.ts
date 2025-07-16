import { Routes } from '@angular/router';
import { authGuard } from '../../core/middlewares';

export const routes: Routes = [
    {
        path: 'users',
        canActivate: [authGuard],
        loadComponent: () =>
            import('../../core/layout/auth/auth.component').then(
            (c) => c.AuthComponent,
        ),
        children: [
            {
                path: '',
                title: 'Usuários',
                loadComponent: () =>
                    import('./pages/users-index/users-index.component').then(
                    (c) => c.UsersIndexComponent,
                ),
            },
            {
                path: 'create',
                title: 'Criar Usuário',
                loadComponent: () =>
                    import('./pages/users-form/users-form.component').then(
                    (c) => c.UsersFormComponent,
                ),
            },
            {
                path: 'edit/:id',
                title: 'Editar Usuário',
                loadComponent: () =>
                    import('./pages/users-form/users-form.component').then(
                    (c) => c.UsersFormComponent,
                ),
            }
        ],
    }
];