import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    try {
        // Verifica se o usuário está realmente autenticado (cookie + sessão válida)
        const isAuthenticated = authService.authState();

        console.debug('AuthGuard status:', isAuthenticated);

        if (isAuthenticated) {
            return true;
        }
    } catch (error) {
        console.error(
            '[AuthGuard] Não foi possível verificar a autenticação:',
            error,
        );
    }

    router.navigate(['/auth/login'], {});

    return false;
};
