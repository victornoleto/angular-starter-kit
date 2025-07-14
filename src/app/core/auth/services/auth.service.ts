import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { env } from '../../../../env';

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    [key: string]: any; // Adjust based on actual response structure
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    
    constructor(private http: HttpClient) {}
    
    login(data: LoginPayload): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${env.url}/api/login`, data);
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${env.url}/api/logout`, {}).pipe(
            tap(() => {
                this.clearAuthCookies();
            })
        );
    }

    getUser(): Observable<any> {
        return this.http.get<any>(`${env.url}/api/user`);
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            // Primeiro verifica se existe o cookie CSRF
            const token = await this.sanctumCsrf();
            if (!token) {
                return false;
            }

            // Depois verifica se a sessão é válida fazendo uma chamada para a API
            await firstValueFrom(this.getUser());
            return true;
        } catch (error: any) {
            // Se retornar 401 ou qualquer erro, usuário não está autenticado
            if (error?.status === 401) {
                // Remove cookies inválidos
                this.clearAuthCookies();
            }
            return false;
        }
    }

    private clearAuthCookies(): void {
        // Remove o cookie XSRF-TOKEN
        document.cookie = 'XSRF-TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // Remove o cookie de sessão do Laravel se existir
        document.cookie = 'laravel_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        console.debug('Authentication cookies cleared');
    }

    async sanctumCsrf(): Promise<string | null> {
        
        let token = this.getTokenFromCookie();
        
        // Se não existir o token, buscar no backend
        if (!token) {
            await firstValueFrom(
                this.http.get(`${env.url}/sanctum/csrf-cookie`)
            );
            token = this.getTokenFromCookie();
        }
        
        return token;
    }
    
    private getTokenFromCookie(): string | null {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    }
}