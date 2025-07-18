import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    DialogComponent,
    DialogConfig,
} from '../components/dialog/dialog.component';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private modalService = inject(NgbModal);

    open(config: DialogConfig): void {
        const modalRef = this.modalService.open(DialogComponent, {
            size: config.size || 'md',
            backdrop: config.backdrop || 'static',
            keyboard: config.keyboard || true,
            centered: config.centered || false,
        });

        modalRef.componentInstance.data.set(config);
    }
}
