import { Component, output, input, effect, model } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UsersFilters } from '../../../../models/users-filters.model';
import { JsonPipe } from '@angular/common';
import { isEqual } from '../../../../../../shared/utils/compare.utils';

@Component({
    selector: 'app-users-filters',
    imports: [
        ReactiveFormsModule,
        JsonPipe,
    ],
    templateUrl: './users-filters.component.html',
    styleUrl: './users-filters.component.scss',
})
export class UsersFiltersComponent {

    private readonly fb = new FormBuilder();

    readonly form = this.fb.group({
        search: ['', []],
    });

    readonly value = input<UsersFilters>({});
    readonly onFiltersChanged = output<UsersFilters>();

    constructor() {

        effect(() => {

            const value = this.value();
            const formValue = this.form.value as UsersFilters;

            if (!isEqual(value, formValue)) {
                this.form.patchValue(value, {
                    emitEvent: false // Não emite evento ao inicializar o formulário
                });
            }
        })

        this.form.valueChanges.subscribe(value => {
            this.onFiltersChanged.emit(value as UsersFilters);
        })
    }
}
