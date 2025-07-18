import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { env } from '../../../env';
import { Observable } from 'rxjs';
import { LengthAwarePaginator } from '../../shared/models/length-aware-paginator';
import { User } from '../../core/auth/models/user.model';
import { UsersFilters } from './pages/users-index/components/users-filters/users-filters.component';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${env.url}/api/users`;

    get(filters: UsersFilters = {}): Observable<LengthAwarePaginator<User>> {
        return this.http.get<LengthAwarePaginator<User>>(this.baseUrl, {
            params: filters,
        });
    }

    delete(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${userId}`);
    }
}
