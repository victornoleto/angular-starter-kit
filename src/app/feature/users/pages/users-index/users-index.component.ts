import {
    Component,
    OnInit,
    signal,
    effect,
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
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { getErrorMessage } from '../../../../shared/utils/error.utils';
import { PageMessageComponent } from '../../../../shared/components/page-message/page-message.component';
import { DialogService } from '../../../../shared/services/dialog.service';
import { BaseIndexService } from '../../../../shared/services/base-index.service';

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
    providers: [BaseIndexService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersIndexComponent implements OnInit {
    private readonly usersService = inject(UsersService);
    private readonly dialogService = inject(DialogService);
    protected readonly pageState = inject(BaseIndexService<UsersFilters>);

    protected readonly users = signal<LengthAwarePaginator<User> | null>(null);
    protected readonly filters = signal<UsersFilters>({});

    private readonly usersFiltersComponent = viewChild.required(UsersFiltersComponent);

    constructor() {
        // Effect que dispara a busca automaticamente quando os parâmetros mudam
        effect(() => {
            //const params = this.pageState.searchParams();
            //this.fetchUsers(params);
        });
    }

    ngOnInit(): void {
        console.debug('UsersIndexComponent initialized');
        //this.pageState.initializeFromQueryParams();
    }

    private fetchUsers(params: UsersFilters): void {

        console.debug('users-index@fetchUsers', params);

        this.pageState.setLoading(true);
        this.pageState.setError(null);

        // Atualizar URL com os parâmetros atuais
        //this.pageState.updateUrlParams(params);

        /* this.usersService.get(params).subscribe({
            next: (response) => {
                this.users.set(response);
                this.pageState.setLoading(false);
            },
            error: (error) => {
                this.pageState.setError(getErrorMessage(error));
                this.pageState.setLoading(false);
            },
        }); */
    }

    // Event handlers
    onPerPageChange(perPage: number): void {
        this.pageState.setPerPage(perPage);
    }

    onPageChange(page: number): void {
        this.pageState.setPage(page);
    }

    onSortChange(sort: TableSort): void {
        this.pageState.setSort(sort);
    }

    onDeleteConfirmed(user: User): void {
        this.usersService.delete(user.id).subscribe({
            next: () => {
                // O effect vai automaticamente recarregar os dados
                // Mas precisamos forçar um refresh mantendo os parâmetros atuais
                const currentParams = this.pageState.searchParams();
                this.fetchUsers(currentParams);
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
