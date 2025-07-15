import { Injectable, ElementRef } from '@angular/core';

// Interface para estender HTMLElement com propriedades customizadas
interface AlertElement extends HTMLElement {
    dismissTimeout?: number;
}

export interface AlertOptions {
    message: string;
    title?: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number | boolean;
    dismissible?: boolean;
    container?: ElementRef<HTMLDivElement>;
    onDismiss?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

    constructor() {}

    show(options: AlertOptions): void {
        const {
            message,
            title = null,
            type = 'info',
            duration = 5000,
            dismissible = true,
            container,
            onDismiss
        } = options;

        let classNames = [
            'alert',
            'alert-' + (type == 'error' ? 'danger' : type),
            'animate__animated',
            'animate__fadeInDown',
        ];

        if (dismissible) {
            classNames.push('alert-dismissible');
        }

        // Create alert element
        const alertElement = document.createElement('div') as AlertElement;
        alertElement.className = classNames.join(' ');
        alertElement.innerHTML = `
            ${title ? `<small>${title}</small> ` : ''}
            <p class="m-0">${message}</p>
            ${dismissible ? '<button type="button" class="btn-close" aria-label="Close"><i class="fal fa-times"></i></button>' : ''}
        `;

        if (dismissible) {
            const closeButton = alertElement.querySelector('.btn-close');
            closeButton?.addEventListener('click', () => {
                this.dismiss(alertElement, onDismiss);
            });
        }

        var defaultContainerElement = document.querySelector('#alert-container') as HTMLDivElement;

        // Append to container or body
        // TODO: no futuro, se não tiver o container, exibir alerta num dialog
        (container?.nativeElement || defaultContainerElement || document.body).appendChild(alertElement);

        if (typeof duration === 'number' && duration > 0) {
            // Auto-dismiss after duration
            alertElement.dismissTimeout = setTimeout(() => {
                this.dismiss(alertElement, onDismiss);
            }, duration);
        }
    }

    dismiss(alertElement: AlertElement, onDismiss?: () => void): void {

        // Cancela o timeout se existir
        if (alertElement.dismissTimeout) {
            clearTimeout(alertElement.dismissTimeout);
            alertElement.dismissTimeout = undefined;
        }

        alertElement.classList.remove('animate__fadeInDown');

        alertElement.classList.add('animate__fadeOutUp');

        setTimeout(() => {
            alertElement.remove();
        }, 300);

        onDismiss?.();
    }
}