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
                },
                error: (error) => {
                    console.error('Logout failed:', error);
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
