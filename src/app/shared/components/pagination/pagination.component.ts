import { Component, computed, input, OnInit, output } from '@angular/core';
import { LengthAwarePaginator } from '../../models/length-aware-paginator';

@Component({
    selector: 'app-pagination',
    imports: [],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit {
    readonly pagination = input<LengthAwarePaginator<any> | null>(null);

    readonly onChange = output<number>();

    changePage(page: number | string): void {
        this.onChange?.emit(Number(page));
    }

    ngOnInit(): void {
        console.debug('PaginationComponent initialized');
    }
}
