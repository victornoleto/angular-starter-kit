import { Component, computed, input, model, ModelSignal, output } from '@angular/core';
import { LengthAwarePaginator, PaginatorLink } from '../../models/length-aware-paginator';
import { PerPageComponent } from '../form/per-page/per-page.component';
import { JsonPipe } from '@angular/common';

export interface PaginationProps {
    page: number;
    perPage: number;
}

@Component({
    selector: 'app-pagination',
    imports: [
        PerPageComponent,
        JsonPipe,
    ],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
})
export class PaginationComponent {

    readonly collection = input<LengthAwarePaginator<any>>();

    readonly links = computed(() => {
        return this.collection()?.links || [];
    });

    readonly currentPage = computed(() => {
        return this.collection()?.current_page || 1;
    });

    readonly perPage = computed(() => {
        return this.collection()?.per_page || 10;
    });

    onPerPageChange = output<number>();
    onPageChange = output<string | number>();

    onPerPageChanged(value: number): void {
        this.onPerPageChange.emit(value);
    }

    onPageChanged(page: string | number): void {
        this.onPageChange.emit(page);
    }
}
