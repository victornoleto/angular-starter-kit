import { HttpClient, HttpParams, httpResource, HttpResourceRequest } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { env } from '../../../env';
import { Observable } from 'rxjs';
import { LengthAwarePaginator } from '../../shared/models/paginator';
import { User } from './models/user.model';
import { UsersSearch } from './models/users-search.model';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${env.url}/api/users`;

    get(params: UsersSearch = {}): Observable<LengthAwarePaginator<User>> {
        return this.http.get<LengthAwarePaginator<User>>(this.baseUrl, {
            params: new HttpParams({
                fromObject: {
                    ...params?.filters,
                    ...params?.pagination,
                    ...params?.sort,
                }
            }),
        });
    }

    delete(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${userId}`);
    }
}
