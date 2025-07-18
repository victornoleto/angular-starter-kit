import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export interface BaseIndexProps extends Record<string, any> {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
}

export interface TableSort {
    column: string;
    direction: 'asc' | 'desc';
}

/**
 * Serviço genérico para gerenciar estado de CRUDs
 * Facilita a comunicação reativa entre componentes de listagem
 */
@Injectable()
export class BaseIndexService<TFilters extends BaseIndexProps = BaseIndexProps> {

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    // State signals - públicos para acesso direto, mas readonly por natureza dos signals
    readonly currentPage = signal<number>(1);
    readonly currentPerPage = signal<number>(10);
    readonly currentSort = signal<TableSort | null>(null);
    readonly filters = signal<Omit<TFilters, 'page' | 'per_page' | 'sort_by' | 'sort_direction'>>({} as any);
    readonly isLoading = signal<boolean>(false);
    readonly error = signal<string | null>(null);

    // Computed signal que combina todos os parâmetros de busca
    readonly searchParams = computed(() => {
        const params: TFilters = {
            ...this.filters(),
            page: this.currentPage(),
            per_page: this.currentPerPage(),
        } as TFilters;

        const sort = this.currentSort();
        if (sort) {
            params.sort_by = sort.column;
            params.sort_direction = sort.direction;
        }

        return params;
    });

    constructor(
    ) {
        this.initializeFromQueryParams();
    }

    /**
     * Inicializa o estado a partir dos parâmetros da URL
     */
    initializeFromQueryParams(): void {

        const queryParams = this.activatedRoute.snapshot.queryParams;
        
        // Inicializa a página atual a partir do parâmetro 'page'
        if (queryParams['page']) {  
            const pageParam = Number(queryParams['page']);
            if (!isNaN(pageParam) && pageParam > 0) {
                this.currentPage.set(pageParam);
            }
        }

        // Inicializa per_page
        if (queryParams['per_page']) {
            const perPageParam = Number(queryParams['per_page']);
            if (!isNaN(perPageParam) && perPageParam > 0) {
                this.currentPerPage.set(perPageParam);
            }
        }

        // Inicializa ordenação se presente
        if (queryParams['sort_by'] && queryParams['sort_direction']) {
            this.currentSort.set({
                column: queryParams['sort_by'],
                direction: queryParams['sort_direction']
            });
        }

        console.debug('base-index.service@initializeFromQueryParams', {
            currentPage: this.currentPage(),
            currentPerPage: this.currentPerPage(),
            currentSort: this.currentSort(),
            filters: this.filters(),
        });
    }

    /**
     * Atualiza a URL com os parâmetros atuais
     */
    updateUrlParams(params: TFilters): void {

        const cleanedParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        ); 

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: cleanedParams,
            queryParamsHandling: 'replace',
        });
    }

    /**
     * Atualiza a página atual
     */
    setPage(page: number): void {
        this.currentPage.set(page);
    }

    /**
     * Atualiza o número de itens por página e reseta para a primeira página
     */
    setPerPage(perPage: number): void {
        this.currentPage.set(1);
        this.currentPerPage.set(perPage);
    }

    /**
     * Atualiza a ordenação e reseta para a primeira página
     */
    setSort(sort: TableSort | null): void {
        this.currentSort.set(sort);
        this.currentPage.set(1);
    }

    /**
     * Atualiza os filtros e reseta para a primeira página
     */
    setFilters(filters: Omit<TFilters, 'page' | 'per_page' | 'sort_by' | 'sort_direction'>): void {
        console.debug('base-index.service@setFilters', filters);
        this.filters.set(filters);
        this.currentPage.set(1);
    }

    /**
     * Define o estado de carregamento
     */
    setLoading(isLoading: boolean): void {
        this.isLoading.set(isLoading);
    }

    /**
     * Define mensagem de erro
     */
    setError(error: string | null): void {
        this.error.set(error);
    }

    /**
     * Limpa todos os filtros e reseta o estado
     */
    clearFilters(): void {
        this.filters.set({} as any);
        this.currentPage.set(1);
        this.currentSort.set(null);
    }

    /**
     * Reseta completamente o estado
     */
    reset(): void {
        this.currentPage.set(1);
        this.currentPerPage.set(10);
        this.currentSort.set(null);
        this.filters.set({} as any);
        this.isLoading.set(false);
        this.error.set(null);
    }
}
