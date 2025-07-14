import { Component, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/services/auth.service';
import { env } from '../env';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
        effect(() => {
            const isAuthenticated = this.authService.authState();
            console.debug('Auth state changed', isAuthenticated);
            if (!isAuthenticated) {
                this.router.navigate(['/auth/login']);
            } else {
                this.router.navigate(['/dashboard']);
            }
        });
    }
    
    ngOnInit(): void {
        console.log('AppComponent initialized', {env});
    }
}
