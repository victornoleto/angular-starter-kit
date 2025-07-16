import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-per-page',
    imports: [ReactiveFormsModule],
    templateUrl: './per-page.component.html',
    styleUrl: './per-page.component.scss',
})
export class PerPageComponent {
    readonly options = input<number[]>([10, 25, 50, 100], {});
    readonly value = input<number | undefined>(10);

    readonly onChange = output<number>();

    handleChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        this.onChange?.emit(Number(selectElement.value));
    }
}