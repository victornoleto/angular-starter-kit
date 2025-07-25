import { Directive, ElementRef, input, output, computed, model, effect } from '@angular/core';

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

    readonly sort = model.required<TableSort>({
        alias: 'appTableSortable',
    });

    constructor(private elementRef: ElementRef<HTMLTableElement>) {

        const table = this.elementRef.nativeElement;

        table.classList.add('table-sortable');
    
        // Adiciona event listener para clicks na tabela
        table.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
    
            // Verifica se o elemento clicado é um th com data-sort
            if (target.tagName === 'TH' && target.hasAttribute('data-sort')) {
                this.handleSort(target);
            }
        });

        effect(() => {
            this.updateClasses();
        });
    }

    private handleSort(thElement: HTMLElement): void {

        const sortBy = thElement.getAttribute('data-sort');

        if (!sortBy) return;

        const currentSort = this.sort();

        let sortDirection: 'asc' | 'desc' = 'asc';

        // Se é a mesma coluna, alterna a direção
        if (currentSort && currentSort.sortBy === sortBy) {
            sortDirection = currentSort.sortDirection === 'asc' ? 'desc' : 'asc';
        }

        const newSort: TableSort = { sortBy, sortDirection };

        // Atualizando o sort automaticamente as classes serão atualizadas
        // através do effect que observa a mudança do sort
        this.sort.set(newSort);
    }

    private updateClasses(): void {

        const currentSort = this.sort();

        console.debug('Updating header classes for sort:', currentSort);

        const table = this.elementRef.nativeElement;
        const allHeaders = table.querySelectorAll('th[data-sort]');

        // Remove classes de ordenação de todos os headers
        allHeaders.forEach((header) => {
            header.classList.remove('sorted-asc', 'sorted-desc');
        });

        if (currentSort) {

            // Encontra o header correspondente ao sortBy atual e adiciona a classe
            const activeHeader = Array.from(allHeaders).find(
                (header) => header.getAttribute('data-sort') === currentSort.sortBy
            );
    
            if (activeHeader) {
                activeHeader.classList.add(`sorted-${currentSort.sortDirection}`);
            }
        }
    }
}
