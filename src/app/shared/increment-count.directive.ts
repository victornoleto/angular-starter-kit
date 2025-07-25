import { computed, Directive, effect, ElementRef, input, model } from '@angular/core';

@Directive({
	selector: 'button[appIncrementCount]'
})
export class IncrementCountDirective {
	
	readonly count = model.required<number>();
	
	constructor(
		private elementRef: ElementRef<HTMLButtonElement>
	) {
		this.elementRef.nativeElement.addEventListener('click', () => {
			this.count.set(this.count() + 1);
		});
		
		effect(() => {
			this.updateText();
		});
	}

	private updateText(): void {
		const currentCount = this.count();
		this.elementRef.nativeElement.textContent = `Count: ${currentCount}`;
	}
}
