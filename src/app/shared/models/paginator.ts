export interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface LengthAwarePaginator<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginatorLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface Paginator {
    page: 1,
    perPage: 10,
};

export const DEFAULT_PAGINATION: Paginator = {
    page: 1,
    perPage: 10,
};

export const DEFAULT_COLLECTION: LengthAwarePaginator<any> = {
    current_page: 1,
    data: [],
    first_page_url: '',
    from: 0,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 10,
    prev_page_url: null,
    to: 0,
    total: 0,
};