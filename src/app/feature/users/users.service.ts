import { HttpClient, HttpParams, httpResource, HttpResourceRequest } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { env } from '../../../env';
import { Observable } from 'rxjs';
import { LengthAwarePaginator } from '../../shared/models/length-aware-paginator';
import { User } from '../../core/auth/models/user.model';
import { UsersFilters } from './pages/users-index/components/users-filters/users-filters.component';
import { TableSort } from '../../shared/directives';
import { PaginationProps } from '../../shared/components/pagination/pagination.component';

export interface SearchProps {
    sort?: TableSort;
    pagination?: PaginationProps;
}

export interface UsersSearchProps extends SearchProps {
    filters?: UsersFilters;
}

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${env.url}/api/users`;

    /* get(filters: UsersFilters = {}): Observable<LengthAwarePaginator<User>> {
        return this.http.get<LengthAwarePaginator<User>>(this.baseUrl, {
            params: filters,
        });
    } */

    get(props: Signal<any> = signal({})) {
        console.debug('users.service get', props());
        return httpResource<any>(() => {
            /* const params = {
                ...props().filters,
                ...props().pagination,
            }; */
            return {
                url: this.baseUrl,
                params: new HttpParams({
                    fromObject: {
                        ...props().filters,
                        ...props().pagination,
                    }
                    //fromObject: params,
                }),
            } as HttpResourceRequest
        })
    }

    delete(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${userId}`);
    }
}
