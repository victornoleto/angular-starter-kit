import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { env } from '../../../../env';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    user = signal<User | null>(null);

    authState = signal<boolean>(false);
    
    constructor(private http: HttpClient) {}
    
    login(data: any): Observable<any> {
        return this.http.post<any>(`${env.url}/api/login`, data).pipe(
            tap((response: any) => {
                console.debug('[AuthService] User logged in', response);
                this.authState.set(true);
            })
        );
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${env.url}/api/logout`, {}).pipe(
            tap(() => {
                console.debug('[AuthService] User logged out');
                this.authState.set(false);
                this.user.set(null);
            })
        );
    }

    getUser(): Observable<User> {
        return this.http.get<User>(`${env.url}/api/user`).pipe(
            tap((user: User) => {
                console.debug('[AuthService] User updated', user);
                this.user.set(user);
            })
        );
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            // Se no futuro a rota de obter o usuário ficar "pesada" demais,
            // criar uma rota apenas para verificar a autenticação
            await firstValueFrom(this.getUser());
            this.authState.set(true);
        } catch (error: HttpErrorResponse | any) {
            if (error && error.status !== 401) {
                console.error('[AuthService] Error checking initial auth state', error);
            }
            this.authState.set(false);
        }
        return this.authState();
    }

    async sanctumCsrf(): Promise<string | null> {
        
        await firstValueFrom(
            this.http.get(`${env.url}/sanctum/csrf-cookie`)
        );

        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        
        return match ? decodeURIComponent(match[1]) : null;
    }
}