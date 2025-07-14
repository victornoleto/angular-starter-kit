import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { FormValidationDirective } from './form-validation.directive';

@Component({
    template: `
        <form [appFormValidation]="testForm()" [formSubmitted]="submitted()">
            <div class="fc-email">
                <label for="email">Email</label>
                <input
                    id="email"
                    type="email"
                    class="form-control"
                    formControlName="email"
                />
            </div>
            <div class="fc-name">
                <label for="name">Nome</label>
                <input
                    id="name"
                    type="text"
                    class="form-control"
                    formControlName="name"
                />
            </div>
        </form>
    `,
})
class TestComponent {
    private fb = new FormBuilder();

    readonly testForm = signal<FormGroup>(
        this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', [Validators.required, Validators.minLength(3)]],
        })
    );

    readonly submitted = signal(false);

    submit(): void {
        this.submitted.set(true);
    }
}

describe('FormValidationDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [ReactiveFormsModule, FormValidationDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display error messages when form is submitted with invalid data', () => {
        component.submit();
        fixture.detectChanges();

        const emailError = fixture.nativeElement.querySelector(
            '.fc-email .error-message'
        );
        const nameError = fixture.nativeElement.querySelector(
            '.fc-name .error-message'
        );

        expect(emailError).toBeTruthy();
        expect(nameError).toBeTruthy();
        expect(emailError.textContent).toContain('obrigatório');
        expect(nameError.textContent).toContain('obrigatório');
    });

    it('should hide error messages when form becomes valid', () => {
        // Primeiro submete com dados inválidos
        component.submit();
        fixture.detectChanges();

        // Depois preenche com dados válidos
        const form = component.testForm();
        form.patchValue({
            email: 'test@example.com',
            name: 'João Silva',
        });
        fixture.detectChanges();

        const emailError = fixture.nativeElement.querySelector(
            '.fc-email .error-message'
        );
        const nameError = fixture.nativeElement.querySelector(
            '.fc-name .error-message'
        );

        expect(emailError).toBeFalsy();
        expect(nameError).toBeFalsy();
    });

    it('should add error classes to invalid fields', () => {
        component.submit();
        fixture.detectChanges();

        const emailField = fixture.nativeElement.querySelector('.fc-email');
        const nameField = fixture.nativeElement.querySelector('.fc-name');

        expect(emailField).toHaveClass('fc-error');
        expect(nameField).toHaveClass('fc-error');
    });
});
