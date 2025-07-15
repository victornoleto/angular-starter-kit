import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { FormValidationDirective } from '../../directives/form-validation.directive';

@Component({
    selector: 'app-example-form',
    template: `
        <div class="container">
            <h2>Exemplo de Formulário com Validação</h2>

            <form
                [formGroup]="userForm()"
                [appFormValidation]="userForm()"
                [formSubmitted]="submitted()"
                (ngSubmit)="onSubmit()"
            >
                <div class="fc-name">
                    <label for="name">Nome Completo</label>
                    <input
                        id="name"
                        type="text"
                        class="form-control"
                        formControlName="name"
                        placeholder="Digite seu nome completo"
                    />
                </div>

                <div class="fc-email">
                    <label for="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        class="form-control"
                        formControlName="email"
                        placeholder="Digite seu email"
                    />
                </div>

                <div class="fc-age">
                    <label for="age">Idade</label>
                    <input
                        id="age"
                        type="number"
                        class="form-control"
                        formControlName="age"
                        placeholder="Digite sua idade"
                    />
                </div>

                <div class="fc-password">
                    <label for="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        class="form-control"
                        formControlName="password"
                        placeholder="Digite sua senha"
                    />
                </div>

                <div class="fc-confirmPassword">
                    <label for="confirmPassword">Confirmar Senha</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        class="form-control"
                        formControlName="confirmPassword"
                        placeholder="Confirme sua senha"
                    />
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Enviar
                    </button>
                    <button
                        type="button"
                        class="btn btn-secondary"
                        (click)="resetForm()"
                    >
                        Limpar
                    </button>
                </div>
            </form>

            @if (isFormValid()) {
                <div class="success-message">
                    ✅ Formulário válido! Dados prontos para envio.
                </div>
            }
        </div>
    `,
    styleUrl: './example-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, FormValidationDirective],
})
export class ExampleFormComponent {
    private readonly fb = new FormBuilder();

    readonly userForm = signal<FormGroup>(
        this.fb.group(
            {
                name: ['', [Validators.required, Validators.minLength(3)]],
                email: ['', [Validators.required, Validators.email]],
                age: [
                    '',
                    [
                        Validators.required,
                        Validators.min(18),
                        Validators.max(120),
                    ],
                ],
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', [Validators.required]],
            },
            {
                validators: this.passwordMatchValidator,
            },
        ),
    );

    readonly submitted = signal(false);

    readonly isFormValid = signal(false);

    onSubmit(): void {
        this.submitted.set(true);

        const form = this.userForm();
        if (form.valid) {
            this.isFormValid.set(true);
            console.log('Dados do formulário:', form.value);

            // Aqui você faria o envio dos dados
            // this.userService.createUser(form.value);
        } else {
            this.isFormValid.set(false);
            form.markAllAsTouched();
        }
    }

    resetForm(): void {
        this.submitted.set(false);
        this.isFormValid.set(false);
        this.userForm().reset();
    }

    private passwordMatchValidator(group: FormGroup) {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        if (password !== confirmPassword) {
            group.get('confirmPassword')?.setErrors({
                passwordMismatch: 'As senhas não coincidem',
            });
            return { passwordMismatch: true };
        }

        return null;
    }
}
