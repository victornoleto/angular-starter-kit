import {
    Component,
    inject,
    output,
    signal,
    ElementRef,
    viewChild,
} from '@angular/core';
import {
    NgbActiveModal,
    NgbDatepickerModule,
    NgbModal,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-table-button-delete',
    imports: [NgbDatepickerModule],
    templateUrl: './table-button-delete.component.html',
    styleUrl: './table-button-delete.component.scss',
})
export class TableButtonDeleteComponent {
    private modalService = inject(NgbModal);

    // Referência para o botão
    private deleteButton = viewChild<ElementRef>('deleteButton');

    readonly showConfirmation = signal(true);

    readonly onDelete = output<void>();

    onClick(content: any): void {
        if (this.showConfirmation()) {
            // Remover focus do botão
            // Corrige o warning: Blocked aria-hidden on an element because its descendant retained focus.
            if (this.deleteButton()?.nativeElement) {
                this.deleteButton()!.nativeElement.blur();
            }

            const modalRef = this.modalService.open(content, {
                // Configurações para melhor acessibilidade
                ariaLabelledBy: 'modal-basic-title',
                backdrop: 'static',
                keyboard: true,
            });

            // Melhora o gerenciamento de foco para evitar warnings de acessibilidade
            modalRef.result
                .then(
                    (result: any) => {
                    },
                    (reason: any) => {
                    },
                )
                .finally(() => {});
        } else {
            this.onConfirmed();
        }
    }

    onConfirmed(modal?: NgbActiveModal): void {
        modal?.dismiss();
        this.onDelete.emit();
    }
}
