import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

export const guestGuard: CanActivateFn = async (route, state) => {

    const router = inject(Router);
    const authService = inject(AuthService);

    try {
        // Verifica se o usuário está realmente autenticado (cookie + sessão válida)
        const isAuthenticated = await authService.isAuthenticated();

        console.debug('GuestGuard status:', !isAuthenticated);

        if (!isAuthenticated) {
            return true;
        }

    } catch (error) {
        console.error('[GuestGuard] Não foi possível verificar a autenticação:', error);
        return true;
    }

    router.navigate(['/dashboard']);

    return false;
};
