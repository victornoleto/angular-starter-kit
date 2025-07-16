import { Component, OnInit, signal, computed, ChangeDetectionStrategy, effect, viewChild } from '@angular/core';
import { UsersService } from '../../users.service';
import { LengthAwarePaginator } from '../../../../shared/models/length-aware-paginator';
import { User } from '../../../../core/auth/models/user.model';
import { UsersFilters, UsersFiltersComponent } from './components/users-filters/users-filters.component';
import { UsersTableComponent } from './components/users-table/users-table.component';

@Component({
    selector: 'app-users-index',
    templateUrl: './users-index.component.html',
    styleUrl: './users-index.component.scss',
    imports: [
        UsersFiltersComponent,
        UsersTableComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersIndexComponent implements OnInit {
    
    public users = signal<LengthAwarePaginator<User> | null>(null);

    public currentPerPage = signal<number>(10);
    public currentPage = signal<number>(1);
    
    // Referência para os componentes filhos
    private readonly usersFiltersComponent = viewChild.required(UsersFiltersComponent);
    
    public constructor(
        private readonly usersService: UsersService
    ) {
    }
    
    ngOnInit(): void {
        this.refresh();
    }
    
    refresh() {

        let filters = (this.usersFiltersComponent()?.form.value || {}) as UsersFilters;

        filters.page = this.currentPage();
        filters.per_page = this.currentPerPage();
        
        this.usersService
            .get(filters)
            .subscribe({
                next: (response) => {
                    console.log('Users fetched successfully:', response);
                    this.users.set(response);
                },
                error: (error) => {
                    console.error('Error fetching users:', error);
                }
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
}
