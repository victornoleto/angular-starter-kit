import { filter } from 'rxjs';
import {
    Component,
    OnInit,
    signal,
    ChangeDetectionStrategy,
    viewChild,
    inject,
    resource,
    computed,
    effect,
} from '@angular/core';
import { UsersSearchProps, UsersService } from '../../users.service';
import { LengthAwarePaginator } from '../../../../shared/models/length-aware-paginator';
import { User } from '../../../../core/auth/models/user.model';
import {
    UsersFilters,
    UsersFiltersComponent,
} from './components/users-filters/users-filters.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { TableSort, TableSortableDirective } from '../../../../shared/directives/table-sortable.directive';
import { RouterLink } from '@angular/router';
import { getErrorMessage } from '../../../../shared/utils/error.utils';
import { PageMessageComponent } from '../../../../shared/components/page-message/page-message.component';
import { DialogService } from '../../../../shared/services/dialog.service';
import { env } from '../../../../../env';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { PaginationComponent, PaginationProps } from '../../../../shared/components/pagination/pagination.component';
import { TableButtonsComponent } from '../../../../shared/components/table/table-buttons/table-buttons.component';
import { TableButtonEditComponent } from '../../../../shared/components/table/table-button-edit/table-button-edit.component';
import { TableButtonDeleteComponent } from '../../../../shared/components/table/table-button-delete/table-button-delete.component';
import { generatePlaceholderString, generatePlaceholderVariableString } from '../../../../shared/utils/faker.utils';
import { TableLoadingComponent, TablePlaceholderProps } from '../../../../shared/components/table/table-loading/table-loading.component';

@Component({
    selector: 'app-users-index',
    templateUrl: './users-index.component.html',
    styleUrl: './users-index.component.scss',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        JsonPipe,
        UsersFiltersComponent,
        UsersTableComponent,
        PageMessageComponent,
        PaginationComponent,
        TableSortableDirective,
        DatePipe,
        TableButtonsComponent,
        TableButtonEditComponent,
        TableButtonDeleteComponent,
        TableLoadingComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersIndexComponent implements OnInit {

    private readonly fb = new FormBuilder();

    readonly filtersForm = this.fb.group({
        search: ['', []],
    });

    private readonly usersService = inject(UsersService);
    private readonly dialogService = inject(DialogService);

    sort = signal<TableSort>({
        sortBy: 'id',
        sortDirection: 'desc',
    });

    pagination = signal<PaginationProps>({
        page: 1,
        perPage: 10,
    });

    filters = signal<any>({});

    searchProps = computed(() => {
        const pagination = this.pagination();
        const filters = this.filters();
        const sort = this.sort();
        return {
            filters: {
                ...filters,
                ...pagination,
                ...sort
            },
        }
    });

    constructor() {
        this.filtersForm.valueChanges.subscribe((value) => {
            this.filters.set(value);
        });
    }

    placeholderUsers = Array.from({ length: 10 }, (_, i) => ({
        id: generatePlaceholderString(3),
        name: generatePlaceholderVariableString(6, 28),
        email: generatePlaceholderVariableString(17, 32),
        created_at: generatePlaceholderString(12),
        updated_at: generatePlaceholderString(12),
    }));

    tablePlaceholderProps: TablePlaceholderProps = [
        3, // ID
        { min: 14, max: 28 }, // Name
        { min: 17, max: 32 }, // Email
        12, // Created At
        12, // Updated At
        6, // Actions (buttons)
    ];

    users = this.usersService.get(this.searchProps);

    test = computed(() => {
        return 10;
    });

    ngOnInit(): void {
    }

    onSortChanged(sort: TableSort): void {
        this.sort.set(sort);
    }

    onDeleteConfirmed(user: User): void {
        this.usersService.delete(user.id).subscribe({
            next: () => {
            },
            error: (error) => {
                this.dialogService.open({
                    title: '🔴 Atenção!',
                    message: 'Não foi possível remover o usuário.',
                    details: getErrorMessage(error),
                    actions: [
                        {
                            text: 'Tentar novamente',
                            className: 'btn-primary',
                            handler: () => this.onDeleteConfirmed(user),
                        },
                    ],
                });
            },
        });
    }

    onPerPageChanged(perPage: number): void {
        this.pagination.update((prev) => ({
            ...prev,
            perPage,
            page: 1, // Reset to first page on perPage change
        }));
    }

    onPageChanged(page: string | number): void {
        this.pagination.update((prev) => ({
            ...prev,
            page: Number(page),
        }));
    }

    /* refresh() {
        let filters = (this.usersFiltersComponent()?.form.value ||
            {}) as UsersFilters;

        filters.page = this.currentPage();
        filters.per_page = this.currentPerPage();

        if (this.currentSort()) {
            filters.sort_by = this.currentSort()?.column;
            filters.sort_direction = this.currentSort()?.direction;
        }

        this.usersService.get(filters).subscribe({
            next: (response) => {
                this.error.set(null);
                this.users.set(response);
            },
            error: (error) => {
                this.error.set(getErrorMessage(error));
            },
        });
    } */

    /* onPerPageChange(perPage: number): void {
        this.currentPage.set(1);
        this.currentPerPage.set(perPage);
        this.refresh();
    }

    onPageChange(page: number): void {
        this.currentPage.set(page);
        this.refresh();
    }

    onFiltersChange(): void {
        this.currentPage.set(1);
        this.refresh();
    }

    onSortChange(sort: TableSort): void {
        this.currentSort.set(sort);
        this.refresh();
    }
     */
}
