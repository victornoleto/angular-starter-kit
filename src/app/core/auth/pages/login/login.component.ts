import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormValidationDirective } from '../../../../shared/directives';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        FormValidationDirective,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {

    private readonly fb = new FormBuilder();

    readonly formSubmmited = signal(false);

    readonly form = this.fb.group({
        email: ['victor@sysout.com.br', [Validators.required, Validators.email]],
        password: ['password', [Validators.required, Validators.minLength(6)]],
    })

    public formValid: boolean = false;

    constructor(
        private readonly authService: AuthService,
        private router: Router,
    ) {}

    submit(): void {

        this.formSubmmited.set(true);
        
        this.formValid = this.form.valid;

        if (this.form.invalid) {
            return;
        }

        let credentials: any = {
            email: this.form.value.email || '',
            password: this.form.value.password || '',
        };

        this.authService.login(credentials)
            .subscribe({
                next: (response) => {
                    console.log('Login successful', response);
                },
                error: (error) => {
                    console.error('Login failed', error);
                }
            });
    }
}