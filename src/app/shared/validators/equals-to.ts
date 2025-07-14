import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function equalsToValidator(
    fieldToCompare: string,
    label: string = fieldToCompare,
    message: string = 'Este campo deve ter o valor igual ao campo {label}'
): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent) return null; // Parent ainda não está disponível

        const otherControl = control.parent.get(fieldToCompare);
        if (!otherControl) return null;

        if (control.value !== otherControl.value) {
            return {
                equalsTo: {
                    message: message.replace('{label}', label),
                },
            };
        }

        return null;
    };
}