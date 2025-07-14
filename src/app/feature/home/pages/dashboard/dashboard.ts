import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    logout() {
        this.authService.logout()
            .subscribe({
                next: () => {
                    console.debug('Logout successful');
                    
                    // Redireciona para a página de login após logout
                    this.router.navigate(['/auth/login']).then(() => {
                        // Força um reload da página para garantir que o estado seja limpo
                        window.location.reload();
                    });
                },
                error: (error) => {
                    console.error('Logout failed:', error);
                    // Mesmo em caso de erro, limpa os cookies localmente
                    this.router.navigate(['/auth/login']);
                }
            });
    }

    getUserData() {
        this.authService.getUser()
            .subscribe({
                next: (user) => {
                    console.debug('User data:', user);
                },
                error: (error) => {
                    console.error('Failed to fetch user data:', error);
                }
            });
    }
}
