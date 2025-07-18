import { Component, inject, signal } from '@angular/core';
import {
    NgbActiveModal,
    NgbModal,
    NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';

export interface DialogButton {
    text: string;
    className?: string;
    handler?: () => void;
    closeModal?: boolean;
}

export interface DialogConfig extends NgbModalOptions {
    title: string;
    subtitle?: string;
    message: string;
    details?: string;
    actions: DialogButton[];
}

@Component({
    selector: 'app-dialog',
    imports: [],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent {
    readonly data = signal<DialogConfig>({
        title: '',
        message: '',
        actions: [],
    });
    readonly activeModal = inject(NgbActiveModal);

    onButtonClick(action: DialogButton): void {
        if (action.handler) action.handler();
        if (action.closeModal !== false) {
            this.activeModal.close();
        }
    }
}
