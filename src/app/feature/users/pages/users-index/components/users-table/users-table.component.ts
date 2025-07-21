import { Component, computed, input, model, output, Signal } from '@angular/core';
import { LengthAwarePaginator } from '../../../../../../shared/models/length-aware-paginator';
import { User } from '../../../../../../core/auth/models/user.model';
import { PerPageComponent } from '../../../../../../shared/components/form/per-page/per-page.component';
import { PaginationComponent, PaginationProps } from '../../../../../../shared/components/pagination/pagination.component';
import {
    TableSortableDirective,
    TableSort,
} from '../../../../../../shared/directives/table-sortable.directive';
import { DatePipe, JsonPipe } from '@angular/common';
import { PageMessageComponent } from '../../../../../../shared/components/page-message/page-message.component';
import { TableButtonsComponent } from '../../../../../../shared/components/table/table-buttons/table-buttons.component';
import { TableButtonEditComponent } from '../../../../../../shared/components/table/table-button-edit/table-button-edit.component';
import { TableButtonDeleteComponent } from '../../../../../../shared/components/table/table-button-delete/table-button-delete.component';
import { HttpResourceRef } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-users-table',
    imports: [
        PaginationComponent,
        TableSortableDirective,
        DatePipe,
        JsonPipe,
        PageMessageComponent,
        TableButtonsComponent,
        TableButtonEditComponent,
        TableButtonDeleteComponent,
        FormsModule,
    ],
    templateUrl: './users-table.component.html',
    styleUrl: './users-table.component.scss',
})
export class UsersTableComponent {
    
    readonly users = input.required<HttpResourceRef<LengthAwarePaginator<User>>>();
    readonly sort = input.required<TableSort>();

    readonly pagination = model<PaginationProps>();
    readonly search = model<string>('');

    readonly usersList = computed(() => {
        return this.users() && this.users().value() && Array.isArray(this.users().value().data) ?
            this.users().value().data : [];
    });

    readonly total = computed(() => {
        return this.users()?.value()?.total || 0;
    });

    /* readonly isLoading = input<boolean>(false);

    // Outputs para comunicação com o componente pai
    readonly pageChange = output<number>();
    readonly perPageChange = output<number>();
    readonly sortChange = output<TableSort>();
    readonly deleteConfirmed = output<User>();

    // Computed signal para facilitar o acesso aos dados
    protected readonly usersData = computed(() => this.users()?.data || []); */

    onDeletedConfirmed(user: User): void {
        //this.deleteConfirmed.emit(user);
    }

    onSortChanged(sort: TableSort): void {
        console.debug('Sort changed:', sort);
    }
}
