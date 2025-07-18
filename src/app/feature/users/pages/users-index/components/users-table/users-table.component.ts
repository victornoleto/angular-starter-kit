import { 
    Component, 
    computed, 
    input, 
    OnInit, 
    output, 
    ChangeDetectionStrategy 
} from '@angular/core';
import { LengthAwarePaginator } from '../../../../../../shared/models/length-aware-paginator';
import { User } from '../../../../../../core/auth/models/user.model';
import { PerPageComponent } from '../../../../../../shared/components/form/per-page/per-page.component';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';
import {
    TableSortableDirective,
    TableSort,
} from '../../../../../../shared/directives/table-sortable.directive';
import { DatePipe } from '@angular/common';
import { PageMessageComponent } from '../../../../../../shared/components/page-message/page-message.component';
import { TableButtonsComponent } from '../../../../../../shared/components/table/table-buttons/table-buttons.component';
import { TableButtonEditComponent } from '../../../../../../shared/components/table/table-button-edit/table-button-edit.component';
import { TableButtonDeleteComponent } from '../../../../../../shared/components/table/table-button-delete/table-button-delete.component';

@Component({
    selector: 'app-users-table',
    imports: [
        PerPageComponent,
        PaginationComponent,
        TableSortableDirective,
        DatePipe,
        PageMessageComponent,
        TableButtonsComponent,
        TableButtonEditComponent,
        TableButtonDeleteComponent,
    ],
    templateUrl: './users-table.component.html',
    styleUrl: './users-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTableComponent implements OnInit {
    // Input signals
    readonly users = input.required<LengthAwarePaginator<User> | null>();
    readonly isLoading = input<boolean>(false);

    // Output signals para comunicação com o componente pai
    readonly pageChange = output<number>();
    readonly perPageChange = output<number>();
    readonly sortChange = output<TableSort>();
    readonly deleteConfirmed = output<User>();

    // Computed signals para facilitar o acesso aos dados
    protected readonly usersData = computed(() => this.users()?.data || []);
    protected readonly hasUsers = computed(() => this.usersData().length > 0);
    protected readonly totalUsers = computed(() => this.users()?.total || 0);
    protected readonly currentPage = computed(() => this.users()?.current_page || 1);
    protected readonly lastPage = computed(() => this.users()?.last_page || 1);
    protected readonly perPage = computed(() => this.users()?.per_page || 10);

    ngOnInit(): void {
        console.debug('UsersTableComponent initialized');
    }

    // Event handlers
    onPageChanged(page: number): void {
        this.pageChange.emit(page);
    }

    onPerPageChanged(perPage: number): void {
        this.perPageChange.emit(perPage);
    }

    onSortChanged(sort: TableSort): void {
        this.sortChange.emit(sort);
    }

    onDeleteUser(user: User): void {
        this.deleteConfirmed.emit(user);
    }
}
