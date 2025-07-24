import { Component, computed, input, model, output, signal, Signal } from '@angular/core';
import { LengthAwarePaginator } from '../../../../../../shared/models/paginator';
import { User } from '../../../../models/user.model';
import { PerPageComponent } from '../../../../../../shared/components/form/per-page/per-page.component';
import { PaginationComponent, PaginationProps } from '../../../../../../shared/components/pagination/pagination.component';
import {
    TableSortableDirective,
    TableSort,
    DEFAULT_SORT,
} from '../../../../../../shared/directives/table-sortable.directive';
import { DatePipe, JsonPipe } from '@angular/common';
import { PageMessageComponent } from '../../../../../../shared/components/page-message/page-message.component';
import { TableButtonsComponent } from '../../../../../../shared/components/table/table-buttons/table-buttons.component';
import { TableButtonEditComponent } from '../../../../../../shared/components/table/table-button-edit/table-button-edit.component';
import { TableButtonDeleteComponent } from '../../../../../../shared/components/table/table-button-delete/table-button-delete.component';
import { HttpResourceRef } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TableLoadingDirective } from '../../../../../../shared/directives/table-loading.directive';

@Component({
    selector: 'app-users-table',
    imports: [
        DatePipe,
        JsonPipe,
        //PaginationComponent,
        TableSortableDirective,
        PageMessageComponent,
        TableLoadingDirective,
        TableButtonsComponent,
        TableButtonEditComponent,
        TableButtonDeleteComponent,
        FormsModule,
    ],
    templateUrl: './users-table.component.html',
    styleUrl: './users-table.component.scss',
})
export class UsersTableComponent {

    readonly users = input.required<LengthAwarePaginator<User> | null>();
    readonly isLoading = input.required<boolean>();
    readonly sort = model<TableSort>();

    onSortChanged = output<TableSort>();
    onDeleteConfirmed = output<User>();
}