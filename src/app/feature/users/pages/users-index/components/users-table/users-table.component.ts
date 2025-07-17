import { Component, computed, input, output } from '@angular/core';
import { LengthAwarePaginator } from '../../../../../../shared/models/length-aware-paginator';
import { User } from '../../../../../../core/auth/models/user.model';
import { PerPageComponent } from '../../../../../../shared/components/form/per-page/per-page.component';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';
import { TableSortableDirective, TableSort } from '../../../../../../shared/directives/table-sortable.directive';
import { DatePipe } from '@angular/common';
import { PageMessageComponent } from "../../../../../../shared/components/page-message/page-message.component";
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
    styleUrl: './users-table.component.scss'
})
export class UsersTableComponent {
    
    readonly users = input.required<LengthAwarePaginator<User> | null>();
    readonly isLoading = input<boolean>(false);
    
    // Outputs para comunicação com o componente pai
    readonly pageChange = output<number>();
    readonly perPageChange = output<number>();
    readonly sortChange = output<TableSort>();
    readonly deleteConfirmed = output<User>();

    // Computed signal para facilitar o acesso aos dados
    protected readonly usersData = computed(() => this.users()?.data || []);
}
