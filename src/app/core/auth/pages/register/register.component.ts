import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormValidationDirective } from '../../../../shared/directives';
import { equalsToValidator } from '../../../../shared/validators';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink, FormValidationDirective],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent {
    private readonly fb = new FormBuilder();

    readonly formSubmmited = signal(false);

    readonly form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: [
            '',
            [Validators.required, equalsToValidator('password', 'senha')],
        ],
    });

    submit(): void {
        this.formSubmmited.set(true);

        if (this.form.invalid) {
            return;
        }

        /* this.loadingService.show();
		
		this.authService.login(this.form.value.username, this.form.value.password).subscribe({
			next: (response) => {
				this.router.navigate([environment.redirect.auth]);
			},
			error: (response) => {
				console.log(response);
				this.error = response.error?.message || response.message;
				this.openErrorModal();
			},
		}).add(() => {
			this.loadingService.dimsiss();
		}) */
    }
}
