import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {

    const router = inject(Router);
    const authService = inject(AuthService);

    try {
        // Verifica se o usuário está realmente autenticado (cookie + sessão válida)
        const isAuthenticated = await authService.isAuthenticated();

        console.debug('AuthGuard status:', isAuthenticated);

        if (isAuthenticated) {
            return true;
        }

    } catch (error) {
        console.error('[AuthGuard] Não foi possível verificar a autenticação:', error);
    }

    router.navigate(['/auth/login'], {});

    return false;
};
