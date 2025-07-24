import {
    Component,
    signal,
    ChangeDetectionStrategy,
    inject,
    computed,
    effect,
    linkedSignal,
} from '@angular/core';
import { UsersService } from '../../users.service';
import { DEFAULT_PAGINATION, LengthAwarePaginator, Paginator } from '../../../../shared/models/paginator';
import { User } from '../../models/user.model';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { DEFAULT_SORT, TableSort } from '../../../../shared/directives/table-sortable.directive';
import { RouterLink } from '@angular/router';
import { getErrorMessage } from '../../../../shared/utils/error.utils';
import { DialogService } from '../../../../shared/services/dialog.service';
import { JsonPipe } from '@angular/common';
import { UsersFilters } from '../../models/users-filters.model';
import { UsersSearch } from '../../models/users-search.model';
import { UsersFiltersComponent } from './components/users-filters/users-filters.component';

@Component({
    selector: 'app-users-index',
    templateUrl: './users-index.component.html',
    styleUrl: './users-index.component.scss',
    imports: [
    RouterLink,
    JsonPipe,
    //PageMessageComponent,
    UsersTableComponent,
    UsersFiltersComponent,
],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersIndexComponent {

    private readonly usersService = inject(UsersService);
    private readonly dialogService = inject(DialogService);

    //sort = signal<TableSort>(DEFAULT_SORT);
    sort = signal<TableSort>({
        sortBy: 'email',
        sortDirection: 'desc',
    });
    
    pagination = signal<Paginator>(DEFAULT_PAGINATION);

    filters = signal<UsersFilters>({
        search: ''
    });

    usersSearch = signal<UsersSearch | null>(null);

    private readonly updateUsersSearch = effect(() => {
        const sort = this.sort();
        const pagination = this.pagination();
        const filters = this.filters();

        console.debug('users-index@updateUsersSearch', { sort, pagination, filters });

        if (sort !== null && pagination !== null && filters !== null) {
            this.usersSearch.set({
                sort,
                pagination,
                filters,
            });
        } else {
            this.usersSearch.set(null);
        }
    });

    constructor() {
        effect(() => {
            console.log('uses search?', this.usersSearch());
            if (this.usersSearch()) {
                this.refresh();
            }
        });
    }

    users = signal<LengthAwarePaginator<User> | null>(null);
    isLoading = signal<boolean>(true);
    error = signal<string | null>(null);

    refresh(): void {

        const search = this.usersSearch();

        if (!search) {
            return;
        }

        console.debug('users-index@refresh', search);

        this.isLoading.set(true);
        
        this.usersService
            .get(search)
            .subscribe({
                next: (response) => {
                    this.error.set(null);
                    this.users.set(response);
                },
                error: (error) => {
                    this.error.set(getErrorMessage(error));
                },
            }).add(() => {
                this.isLoading.set(false);
            });
    }

    onSortChanged(sort: TableSort): void {
        console.debug('users-index@onSortChanged', sort);
        this.sort.set(sort);
    }

    onDeleteConfirmed(user: User): void {
        console.debug('users-index@onDeleteConfirmed', user);
        /* this.usersService.delete(user.id).subscribe({
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
        }); */
    }

    onFiltersChanged(filters: UsersFilters): void {
        console.debug('users-index@onFiltersChanged', filters);
        this.filters.set(filters);
    }
}
