# Guia de Implementação CRUD com Angular 20

Este guia documenta a implementação de um sistema CRUD reativo usando Angular 20 com signals, seguindo as melhores práticas modernas.

## Arquitetura

A solução implementa uma arquitetura reativa baseada em signals que facilita a comunicação entre componentes e evita múltiplas requisições desnecessárias.

### Componentes Principais

1. **Componente de Listagem** (`users-index.component.ts`)
   - Gerencia o estado principal da página
   - Coordena a comunicação entre filtros e tabela
   - Controla requisições à API

2. **Componente de Filtros** (`users-filters.component.ts`)
   - Formulário reativo para filtros
   - Emite eventos de mudança com debounce
   - Pode ser inicializado com valores da query string

3. **Componente de Tabela** (`users-table.component.ts`)
   - Exibe dados em tabela com ordenação
   - Inclui paginação
   - Emite eventos para ações do usuário

4. **Serviço de Estado** (`crud-state.service.ts`)
   - Centraliza o gerenciamento de estado
   - Fornece signals reativas
   - Sincroniza com a URL

## Características Principais

### 1. Gerenciamento Reativo de Estado

O sistema usa signals do Angular 20 para gerenciar estado reativo:

```typescript
// State signals
protected readonly currentPage = signal<number>(1);
protected readonly currentPerPage = signal<number>(10);
protected readonly currentSort = signal<TableSort | null>(null);
protected readonly filters = signal<Omit<UsersFilters, 'page' | 'per_page' | 'sort_by' | 'sort_direction'>>({});

// Computed signal que combina todos os parâmetros
readonly searchParams = computed(() => {
    const params: TFilters = {
        ...this._filters(),
        page: this._currentPage(),
        per_page: this._currentPerPage(),
    } as TFilters;

    const sort = this._currentSort();
    if (sort) {
        params.sort_by = sort.column;
        params.sort_direction = sort.direction;
    }

    return params;
});
```

### 2. Evitar Múltiplas Requisições

O sistema usa um `effect()` que observa mudanças nos parâmetros e dispara apenas uma requisição:

```typescript
constructor() {
    // Effect que dispara a busca automaticamente quando os parâmetros mudam
    effect(() => {
        const params = this.pageState.searchParams();
        this.fetchUsers(params);
    });
}
```

### 3. Sincronização com URL

Todas as mudanças de estado são automaticamente sincronizadas com a URL:

```typescript
updateUrlParams(params: TFilters): void {
    this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: params,
        queryParamsHandling: 'replace',
    });
}
```

### 4. Inicialização a partir da URL

O sistema pode ser inicializado com valores da query string:

```typescript
initializeFromQueryParams(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    
    if (queryParams['page']) {
        const pageParam = Number(queryParams['page']);
        if (!isNaN(pageParam) && pageParam > 0) {
            this._currentPage.set(pageParam);
        }
    }
    // ... outros parâmetros
}
```

## Regras de Negócio Implementadas

### 1. Reset de Página

Quando há mudança em filtros, ordenação ou itens por página, a página é resetada para 1:

```typescript
setPerPage(perPage: number): void {
    this._currentPage.set(1);  // Reset automático
    this._currentPerPage.set(perPage);
}

setSort(sort: TableSort | null): void {
    this._currentSort.set(sort);
    this._currentPage.set(1);  // Reset automático
}

setFilters(filters: Omit<TFilters, 'page' | 'per_page' | 'sort_by' | 'sort_direction'>): void {
    this._filters.set(filters);
    this._currentPage.set(1);  // Reset automático
}
```

### 2. Debounce nos Filtros

Campos de texto têm debounce para evitar requisições excessivas:

```typescript
this.form
    .get('search')
    ?.valueChanges.pipe(
        debounceTime(300), // 300ms de delay
        distinctUntilChanged(),
        takeUntil(this.destroy$),
    )
    .subscribe(() => {
        if (this.isInitialized()) {
            this.onChange.emit();
        }
    });
```

### 3. Prevenção de Eventos Durante Inicialização

O sistema evita emitir eventos durante a inicialização:

```typescript
protected readonly isInitialized = signal(false);

ngOnInit(): void {
    this.isInitialized.set(true);
}

// Só emite onChange se já foi inicializado
if (this.isInitialized()) {
    this.onChange.emit();
}
```

## Como Usar em Outros CRUDs

### 1. Defina a Interface de Filtros

```typescript
export interface ProductFilters extends CrudFilters {
    search?: string;
    category?: string;
    price_min?: number;
    price_max?: number;
}
```

### 2. Configure o Componente Principal

```typescript
@Component({
    // ...
    providers: [BaseIndexService],
})
export class ProductsIndexComponent implements OnInit {
    private readonly pageState = inject(BaseIndexService<ProductFilters>);
    
    constructor() {
        effect(() => {
            const params = this.pageState.searchParams();
            this.fetchProducts(params);
        });
    }
}
```

### 3. Implemente os Componentes de Filtros e Tabela

Siga o mesmo padrão dos componentes de usuários, adaptando os campos específicos do domínio.

## Vantagens da Implementação

1. **Reatividade**: Mudanças de estado propagam automaticamente
2. **Performance**: Evita requisições desnecessárias
3. **Consistência**: URL sempre sincronizada com o estado
4. **Reutilização**: Serviço genérico para qualquer CRUD
5. **Manutenibilidade**: Código organizado e previsível
6. **TypeScript**: Totalmente tipado para melhor DX

## Tecnologias Utilizadas

- Angular 20+ com signals
- RxJS para programação reativa
- TypeScript com strict mode
- Reactive Forms
- Router para sincronização de URL

Esta implementação segue as melhores práticas modernas do Angular e pode ser facilmente adaptada para outros cenários de CRUD.
