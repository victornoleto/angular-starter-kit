import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import {
    generatePlaceholderString,
    generatePlaceholderVariableString,
} from '../../../utils/faker.utils';
import { JsonPipe } from '@angular/common';

export type TablePlaceholderProps = (number | { min: number; max: number })[];

@Component({
    selector: '[appTableLoading]',
    imports: [
		JsonPipe,
	],
    templateUrl: './table-loading.component.html',
    styleUrl: './table-loading.component.scss',
})
export class TableLoadingComponent {
    readonly n = input<number>(10);

    readonly props = input.required<TablePlaceholderProps>();

    readonly values = computed(() => {
        return Array.from({ length: this.n() }, (_, i) => {
			return this.props().map((prop) => {
				if (typeof prop === 'number') {
					return generatePlaceholderString(prop);
				} else if (
					typeof prop === 'object' &&
					'min' in prop &&
					'max' in prop
				) {
					return generatePlaceholderVariableString(prop.min, prop.max);
				}
				return generatePlaceholderString(5); // Default case if prop is not a number or object
			});
        });
    });
}
