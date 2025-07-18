import { 
    Component, 
    output, 
    OnDestroy, 
    OnInit, 
    inject, 
    signal,
    ChangeDetectionStrategy, 
    input
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { BaseIndexProps } from '../../../../../../shared/services/base-index.service';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';

export interface UsersFilters {
    search?: string;
}

@Component({
    selector: 'app-users-filters',
    imports: [
        ReactiveFormsModule,
        JsonPipe,
    ],
    templateUrl: './users-filters.component.html',
    styleUrl: './users-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFiltersComponent implements OnInit, OnDestroy {

    private readonly activatedRoute = inject(ActivatedRoute);

    private readonly fb = inject(FormBuilder);
    private readonly destroy$ = new Subject<void>();

    readonly form = this.fb.group({
        search: [''],
    });

    constructor() {

        this.initializeFromQueryParams();

        // Setup form change listeners after form is created
        this.form
            .get('search')
            ?.valueChanges.pipe(
                //debounceTime(300), // Aguarda 300ms após o último caractere digitado
                distinctUntilChanged(), // Só emite se o valor mudou
                takeUntil(this.destroy$), // Cancela a subscription quando o componente for destruído
            )
            .subscribe(() => {
                /* this.onChange.emit(
                    this.form.value as UsersFilters
                ); */
            });
    }

    ngOnInit(): void {
        console.debug('UsersFiltersComponent initialized');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    clearFilters(): void {
        this.form.reset();
    }

    initializeFromQueryParams(): void {

        const queryParams = this.activatedRoute.snapshot.queryParams;

        for (const key in queryParams) {
            if (queryParams.hasOwnProperty(key) && this.form.contains(key)) {
                const value = queryParams[key];
                this.form.patchValue({ [key]: value }, {
                    emitEvent: false
                });
            }
        }
    }
}
