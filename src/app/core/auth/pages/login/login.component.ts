import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
    FormValidationDirective,
    LoadingDirective,
    InputPasswordDirective,
} from '../../../../shared/directives';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { getErrorMessage } from '../../../../shared/utils/error.utils';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        FormValidationDirective,
        LoadingDirective,
        InputPasswordDirective,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    @ViewChild('alertContainer') alertContainerRef!: ElementRef<HTMLDivElement>;

    private readonly fb = new FormBuilder();

    readonly form = this.fb.group({
        email: [
            'victor@sysout.com.br',
            [Validators.required, Validators.email],
        ],
        password: [
            'password123',
            [Validators.required, Validators.minLength(6)],
        ],
    });

    public isLoading: boolean = false;
    public formSubmitted: boolean = false;

    constructor(
        private readonly authService: AuthService,
        private readonly alertService: AlertService,
        private readonly router: Router,
    ) {}

    submit(): void {
        this.formSubmitted = true;

        if (this.form.invalid) {
            return;
        }

        let credentials: any = {
            email: this.form.value.email || '',
            password: this.form.value.password || '',
        };

        this.isLoading = true;

        this.authService
            .login(credentials)
            .subscribe({
                next: (response) => {
                    console.log('Login successful', response);
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.alertService.show({
                        message: getErrorMessage(error),
                        title: 'Não foi possível realizar o login',
                        type: 'error',
                        container: this.alertContainerRef,
                    });
                },
            })
            .add(() => {
                this.isLoading = false;
            });
    }
}
