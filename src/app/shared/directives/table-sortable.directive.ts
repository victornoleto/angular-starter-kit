import { Directive, effect, ElementRef, input, model, output, signal } from '@angular/core';

export interface TableSort {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

export const DEFAULT_SORT: TableSort = {
    sortBy: 'id',
    sortDirection: 'desc',
};

@Directive({
    selector: '[appTableSortable]',
})
export class TableSortableDirective {

    // Signal para armazenar a coluna atual sendo ordenada
    currentSort = model<TableSort>();

    // Output para emitir eventos de ordenação
    readonly sortChange = output<TableSort>();

    constructor(private elementRef: ElementRef<HTMLTableElement>) {
        this.setupTableSorting();
    }

    private setupTableSorting(): void {
        const table = this.elementRef.nativeElement;

        // Adiciona event listener para clicks na tabela
        table.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;

            // Verifica se o elemento clicado é um th com data-sort
            if (target.tagName === 'TH' && target.hasAttribute('data-sort')) {
                this.handleSort(target);
            }
        });

        effect(() => {

            const sort = this.currentSort();

            if (sort) {
                const th = table.querySelector(`th[data-sort="${sort.sortBy}"]`);
                if (th) {
                    this.updateHeaderClasses(th as HTMLElement, sort.sortDirection);
                }
            }
        });
    }

    private handleSort(thElement: HTMLElement): void {

        const sortBy = thElement.getAttribute('data-sort');
        if (!sortBy) return;

        const currentSort = this.currentSort();
        let sortDirection: 'asc' | 'desc' = 'asc';

        // Se é a mesma coluna, alterna a direção
        if (currentSort && currentSort.sortBy === sortBy) {
            sortDirection = currentSort.sortDirection === 'asc' ? 'desc' : 'asc';
        }

        const newSort: TableSort = { sortBy, sortDirection };
        this.currentSort.set(newSort);

        // Atualiza as classes visuais dos headers
        this.updateHeaderClasses(thElement, sortDirection);

        // Emite o evento
        this.sortChange.emit(newSort);
    }

    private updateHeaderClasses(
        activeHeader: HTMLElement,
        direction: 'asc' | 'desc',
    ): void {
        const table = this.elementRef.nativeElement;
        const allHeaders = table.querySelectorAll('th[data-sort]');

        // Remove classes de ordenação de todos os headers
        allHeaders.forEach((header) => {
            header.classList.remove('sorted-asc', 'sorted-desc');
        });

        // Adiciona a classe apropriada ao header ativo
        activeHeader.classList.add(`sorted-${direction}`);
    }
}
