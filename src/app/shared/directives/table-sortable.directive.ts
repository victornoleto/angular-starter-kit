import { Directive, ElementRef, output, signal } from '@angular/core';

export interface TableSort {
    column: string;
    direction: 'asc' | 'desc';
}

@Directive({
    selector: '[appTableSortable]'
})
export class TableSortableDirective {
    // Signal para armazenar a coluna atual sendo ordenada
    private readonly currentSort = signal<TableSort | null>(null);
    
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
    }
    
    private handleSort(thElement: HTMLElement): void {
        const column = thElement.getAttribute('data-sort');
        if (!column) return;
        
        const currentSort = this.currentSort();
        let direction: 'asc' | 'desc' = 'asc';
        
        // Se é a mesma coluna, alterna a direção
        if (currentSort && currentSort.column === column) {
            direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        }
        
        const newSort: TableSort = { column, direction };
        this.currentSort.set(newSort);
        
        // Atualiza as classes visuais dos headers
        this.updateHeaderClasses(thElement, direction);
        
        // Emite o evento
        this.sortChange.emit(newSort);
    }
    
    private updateHeaderClasses(activeHeader: HTMLElement, direction: 'asc' | 'desc'): void {
        const table = this.elementRef.nativeElement;
        const allHeaders = table.querySelectorAll('th[data-sort]');
        
        // Remove classes de ordenação de todos os headers
        allHeaders.forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
        });
        
        // Adiciona a classe apropriada ao header ativo
        activeHeader.classList.add(`sorted-${direction}`);
    }
}
