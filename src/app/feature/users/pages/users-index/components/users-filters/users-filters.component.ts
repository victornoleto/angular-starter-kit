import { Component, output, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

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
export class UsersFiltersComponent implements OnDestroy {
    
    private readonly fb = new FormBuilder();
    private readonly destroy$ = new Subject<void>();
    
    readonly form = this.fb.group({
        search: ['', []],
    });
    
    readonly onChange = output<void>();
    
    constructor() {
        this.form.get('search')?.valueChanges
            .pipe(
                debounceTime(100), // Aguarda 500ms após o último caractere digitado
                distinctUntilChanged(), // Só emite se o valor mudou
                takeUntil(this.destroy$) // Cancela a subscription quando o componente for destruído
            )
            .subscribe(() => {
                this.onChange.emit();
            });
    }
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
