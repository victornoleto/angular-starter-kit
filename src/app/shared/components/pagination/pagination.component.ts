import { Component, computed, input, model, ModelSignal, output } from '@angular/core';
import { LengthAwarePaginator } from '../../models/length-aware-paginator';
import { HttpResourceRef } from '@angular/common/http';
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

    readonly collection = input.required<LengthAwarePaginator<any>>();
    readonly pagination = model<PaginationProps>();

    onPerPageChanged(value: number): void {
        console.debug('Per page changed:', value);

        this.pagination.update((prev) => {
            if (prev) {
                return {
                    ...prev,
                    perPage: value,
                    page: 1, // reset to first page when perPage changes
                };
            } else {
                return {
                    page: 1, // default to first page
                    perPage: value,
                };
            }
        });
    }

    onPageChanged(page: string | number): void {
        // update pagination signal value
        console.debug('Page changed:', page);

        this.pagination.update((prev) => {
            if (prev) {
                return {
                    ...prev,
                    page: typeof page === 'string' ? parseInt(page, 10) : page,
                };
            } else {
                return {
                    page: typeof page === 'string' ? parseInt(page, 10) : page,
                    perPage: 10, // default perPage value
                };
            }
        });
    }
}
