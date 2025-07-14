import {
    Directive,
    ElementRef,
    Renderer2,
    input,
    effect,
    signal,
    computed,
    inject,
    DestroyRef,
    OnInit,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ValidationErrors {
    [key: string]: string;
}

interface FieldValidationState {
    hasError: boolean;
    message: string;
}

@Directive({
    selector: '[appFormValidation]',
})
export class FormValidationDirective implements OnInit {
    private readonly el = inject(ElementRef);
    private readonly renderer = inject(Renderer2);
    private readonly destroyRef = inject(DestroyRef);

    // Usando signals para inputs
    readonly form = input.required<FormGroup>({ alias: 'appFormValidation' });
    readonly submitted = input<boolean>(false, { alias: 'formSubmitted' });

    private readonly errorMessages: ValidationErrors = {
        required: 'Este campo é obrigatório',
        email: 'O valor deste campo deve ser um e-mail válido',
        cpf: 'O valor deste campo deve ser um CPF válido',
        minlength: 'O campo precisa ter no mínimo {requiredLength} caracteres',
        maxlength: 'O campo pode ter no máximo {requiredLength} caracteres',
        min: 'O valor mínimo é {min}',
        max: 'O valor máximo é {max}',
        pattern: 'O formato do campo está inválido',
    };

    constructor() {
        // Effect para reagir a mudanças no estado de submissão
        effect(() => {
            const isSubmitted = this.submitted();
            const currentForm = this.form();

            /* console.debug('FormValidationDirective effect', {
                isSubmitted,
                currentForm,
            }); */

            if (isSubmitted && currentForm) {
                this.validate();
            }
        });
    }

    ngOnInit(): void {
        this.setupFormValidation();
    }

    private setupFormValidation(): void {
        const currentForm = this.form();
        if (!currentForm) return;

        Object.keys(currentForm.controls).forEach(fieldName => {
            const control = currentForm.get(fieldName);
            if (control) {
                this.setupFieldValidation(fieldName, control);
            }
        });
    }

    private setupFieldValidation(
        fieldName: string,
        control: AbstractControl
    ): void {
        // Escutar mudanças no valor do campo
        control.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                if (this.submitted()) {
                    this.validateField(fieldName, control);
                }
            });

        // Escutar mudanças no status do campo
        control.statusChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                if (this.submitted()) {
                    this.validateField(fieldName, control);
                }
            });
    }

    private validateField(fieldName: string, control: AbstractControl): void {
        const validationResult = this.getValidationResult(control);
        const errorsContainerElement = this.getErrorsContainerElement(fieldName);

        if (!errorsContainerElement) return;

        // Limpar mensagens de erro anteriores
        errorsContainerElement.childNodes.forEach(child => {
            this.renderer.removeChild(errorsContainerElement, child);
        });

        if (validationResult.hasError) {

            errorsContainerElement.classList.remove('d-none');

            const errorElement = this.renderer.createElement('small');

            this.renderer.addClass(errorElement, 'error-message');
            this.renderer.addClass(errorElement, 'text-danger');
            this.renderer.setProperty(errorElement, 'textContent', validationResult.message);
            this.renderer.appendChild(errorsContainerElement, errorElement);

        } else {
            errorsContainerElement.classList.add('d-none');
        }
    }

    private getErrorsContainerElement(fieldName: string): HTMLElement | null {
        
        var fieldElement = this.el.nativeElement.querySelector(`[formControlName="${fieldName}"]`);

        var containerElement = this.el.nativeElement.querySelector(`.form-error[data-field-name="${fieldName}"]`);

        if (fieldElement) {

            var customErrorsContainerId = fieldElement.getAttribute('data-errors-container-id');

            if (customErrorsContainerId) {
                containerElement = this.el.nativeElement.querySelector(`#${customErrorsContainerId}`);
            }
        }

        // Criar um elemento abaixo do input
        if (!containerElement && fieldElement) {

            containerElement = this.renderer.createElement('div');
            this.renderer.addClass(containerElement, 'd-block');
            this.renderer.addClass(containerElement, 'mt-1');

            // Inserir o elemento após o campo
            const parent = fieldElement.parentNode;
            if (parent) {
                if (fieldElement.nextSibling) {
                    this.renderer.insertBefore(parent, containerElement, fieldElement.nextSibling);
                } else {
                    this.renderer.appendChild(parent, containerElement);
                }
            }
        }

        if (containerElement && !containerElement.classList.contains('form-error')) {
            this.renderer.setAttribute(containerElement, 'data-field-name', fieldName);
            this.renderer.addClass(containerElement, 'form-error');
        }

        return containerElement;
    }

    private getValidationResult(control: AbstractControl): FieldValidationState {

        if (!control.errors || !control.touched) {
            return { hasError: false, message: '' };
        }

        const errorKey = Object.keys(control.errors)[0];
        const errorValue = control.errors[errorKey];

        return {
            hasError: true,
            message: this.getErrorMessage(errorKey, errorValue),
        };
    }

    private getErrorMessage(errorKey: string, errorValue: any): string {

        // Se o erro contém uma mensagem customizada
        if (typeof errorValue === 'string') {
            return errorValue;
        }

        // Se o erro é um objeto com mensagem
        if (typeof errorValue === 'object' && errorValue?.message) {
            return errorValue.message;
        }

        // Buscar mensagem padrão e interpolar valores
        let message =
            this.errorMessages[errorKey] || `Erro de validação: ${errorKey}`;

        // Interpolar valores para erros específicos
        if (typeof errorValue === 'object') {
            message = message.replace(/{(\w+)}/g, (match, key) => {
                return errorValue[key]?.toString() || match;
            });
        }

        return message;
    }
    
    public validate(scrollToError: boolean = false): void {
        const currentForm = this.form();
        if (!currentForm) return;

        Object.keys(currentForm.controls).forEach(fieldName => {
            const control = currentForm.get(fieldName);
            if (control) {
                // Marcar o campo como touched para triggerar validação
                control.markAsTouched();
                this.validateField(fieldName, control);
            }
        });

        if (scrollToError) {
            this.scrollToFirstError();
        }
    }

    private scrollToFirstError(): void {
        const firstErrorElement =
            this.el.nativeElement.querySelector('.fc-error');
        if (firstErrorElement) {
            firstErrorElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }
}
