import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

export interface UsersFilters extends Record<string, any> {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
}

@Component({
    selector: 'app-users-filters',
    imports: [
        ReactiveFormsModule,
    ],
    templateUrl: './users-filters.component.html',
    styleUrl: './users-filters.component.scss'
})
export class UsersFiltersComponent {
    
    private readonly fb = new FormBuilder();
    
    readonly form = this.fb.group({
        search: ['', []],
    });
    
    readonly onChange = output<void>();
    
    constructor(
    ) {
        this.form.valueChanges.subscribe((value) => {
            this.onChange?.emit();
        });
    }
}
