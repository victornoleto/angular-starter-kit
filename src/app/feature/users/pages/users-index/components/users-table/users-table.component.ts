import { Component, computed, input, output } from '@angular/core';
import { LengthAwarePaginator } from '../../../../../../shared/models/length-aware-paginator';
import { User } from '../../../../../../core/auth/models/user.model';
import { PerPageComponent } from '../../../../../../shared/components/form/per-page/per-page.component';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';

@Component({
    selector: 'app-users-table',
    imports: [
        PerPageComponent,
        PaginationComponent,
    ],
    templateUrl: './users-table.component.html',
    styleUrl: './users-table.component.scss'
})
export class UsersTableComponent {
    
    readonly users = input.required<LengthAwarePaginator<User> | null>();
    
    // Outputs para comunicação com o componente pai
    readonly pageChange = output<number>();
    readonly perPageChange = output<number>();

    // Computed signal para facilitar o acesso aos dados
    protected readonly usersData = computed(() => this.users()?.data || []);
    protected readonly isLoading = computed(() => this.users() === null);

    onPerPageChange(value: number): void {
        this.perPageChange.emit(value);
    }

    onPageChange(page: number): void {
        this.pageChange.emit(page);
    }
}
