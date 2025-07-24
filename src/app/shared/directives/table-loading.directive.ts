import { Directive, effect, input } from '@angular/core';

@Directive({
	selector: '[appTableLoading]'
})
export class TableLoadingDirective {
	
	isLoading = input<boolean>(false);


	constructor() {
		effect(() => {
			console.log('table is loading?', this.isLoading());
			this.onLoadingChange(this.isLoading());
		});
	}

	onLoadingChange(loading: boolean): void {
		// TODO: desenhar/apagar loading na tabela
	}
}
