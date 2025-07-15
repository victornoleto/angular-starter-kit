import { RegisterRequest } from './../../models/auth.model';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormValidationDirective, InputPasswordDirective, LoadingDirective } from '../../../../shared/directives';
import { equalsToValidator } from '../../../../shared/validators';
import { AlertService } from '../../../../shared/services/alert.service';
import { AuthService } from '../../services/auth.service';
import { getErrorMessage } from '../../../../shared/utils/error.utils';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        LoadingDirective,
        FormValidationDirective,
        InputPasswordDirective,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent {

    @ViewChild('alertContainer') alertContainerRef!: ElementRef<HTMLDivElement>;

    private readonly fb = new FormBuilder();

    readonly form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: [
            '',
            [Validators.required, equalsToValidator('password', 'senha')],
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

        this.isLoading = true;

        const data: RegisterRequest = {
            name: this.form.value.name || '',
            email: this.form.value.email || '',
            password: this.form.value.password || '',
            password_confirmation: this.form.value.password_confirmation || '',
        };
        
        this.authService
            .register(data)
            .subscribe({
                next: (response) => {
                    console.log('Register successful', response);
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.alertService.show({
                        message: getErrorMessage(error),
                        title: 'Não foi possível realizar o cadastro',
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
