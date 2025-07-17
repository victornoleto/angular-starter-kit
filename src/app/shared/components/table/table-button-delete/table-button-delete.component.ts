import { Component, inject, output, signal, TemplateRef, WritableSignal } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-table-button-delete',
	imports: [
		NgbDatepickerModule
	],
	templateUrl: './table-button-delete.component.html',
	styleUrl: './table-button-delete.component.scss'
})
export class TableButtonDeleteComponent {
	
	private modalService = inject(NgbModal);

	closeResult: WritableSignal<string> = signal('');

	readonly showConfirmation = signal(true); 

	readonly onDelete = output<void>();

	onClick(content: any): void
	{
		if (this.showConfirmation()) {

			this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
				(result: any) => {
					this.closeResult.set(`Closed with: ${result}`);
				},
				(reason: any) => {
					this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
				},
			);

		} else {
			this.onDelete.emit();
		}
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
			return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
			return 'by clicking on a backdrop';
			default:
			return `with: ${reason}`;
		}
	}
}
