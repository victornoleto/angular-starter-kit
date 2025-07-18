import {
    Component,
    OnInit,
    signal,
    ChangeDetectionStrategy,
    viewChild,
    inject,
} from '@angular/core';
import { UsersService } from '../../users.service';
import { LengthAwarePaginator } from '../../../../shared/models/length-aware-paginator';
import { User } from '../../../../core/auth/models/user.model';
import {
    UsersFilters,
    UsersFiltersComponent,
} from './components/users-filters/users-filters.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { TableSort } from '../../../../shared/directives/table-sortable.directive';
import { RouterLink } from '@angular/router';
import { getErrorMessage } from '../../../../shared/utils/error.utils';
import { PageMessageComponent } from '../../../../shared/components/page-message/page-message.component';
import { DialogService } from '../../../../shared/services/dialog.service';

@Component({
    selector: 'app-users-index',
    templateUrl: './users-index.component.html',
    styleUrl: './users-index.component.scss',
    imports: [
        RouterLink,
        UsersFiltersComponent,
        UsersTableComponent,
        PageMessageComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersIndexComponent implements OnInit {
    private readonly usersService = inject(UsersService);
    private readonly dialogService = inject(DialogService);

    public users = signal<LengthAwarePaginator<User> | null>(null);
    public isLoading = signal<boolean>(false);
    public currentPerPage = signal<number>(10);
    public currentPage = signal<number>(1);
    public currentSort = signal<TableSort | null>(null);
    public error = signal<string | null>(null);

    // Referência para os componentes filhos
    private readonly usersFiltersComponent = viewChild.required(
        UsersFiltersComponent,
    );

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
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
    }

    onPerPageChange(perPage: number): void {
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

    onDeleteConfirmed(user: User): void {
        this.usersService.delete(user.id).subscribe({
            next: () => {
                this.refresh();
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
}
