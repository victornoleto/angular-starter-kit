import {
    ComponentRef,
    DestroyRef,
    Directive,
    effect,
    ElementRef,
    inject,
    input,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import { LoadingComponent } from '../components/loading/loading.component';

@Directive({
    selector: '[appLoading]',
})
export class LoadingDirective implements OnInit {
    private readonly el = inject(ElementRef);
    private readonly renderer = inject(Renderer2);
    private readonly viewContainer = inject(ViewContainerRef);

    readonly isLoading = input<boolean | string>(false, {
        alias: 'appLoading',
    });

    private loadingComponentRef: ComponentRef<LoadingComponent> | null = null;
    private originalPosition: string = '';

    constructor() {
        effect(() => {
            const loadingState = this.isLoading();
            const loadingMessage =
                typeof loadingState === 'string' ? loadingState : null;

            if (loadingState) {
                this.addLoading(loadingMessage);
            } else {
                this.removeLoading();
            }
        });
    }

    ngOnInit(): void {
        // Armazena a posição original do elemento para restaurar depois
        this.originalPosition =
            this.el.nativeElement.style.position || 'static';
    }

    private addLoading(message: string | null = null): void {
        // Se já existe um loading component, atualiza a mensagem
        if (this.loadingComponentRef) {
            this.loadingComponentRef.setInput('message', message);
            return;
        }

        this.renderer.addClass(this.el.nativeElement, 'is-loading');

        // Define o elemento como posição relativa para que o loading seja posicionado corretamente
        this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

        // Cria a instância do LoadingComponent
        this.loadingComponentRef =
            this.viewContainer.createComponent(LoadingComponent);

        // Define a mensagem se fornecida
        if (message) {
            this.loadingComponentRef.setInput('message', message);
        }

        // Adiciona o componente ao elemento
        this.renderer.appendChild(
            this.el.nativeElement,
            this.loadingComponentRef.location.nativeElement,
        );
    }

    private removeLoading(): void {
        if (this.loadingComponentRef) {
            console.debug(
                'Removing loading state from element',
                this.el.nativeElement,
            );

            // Remove o componente
            this.loadingComponentRef.destroy();
            this.loadingComponentRef = null;

            // Restaura a posição original do elemento
            this.renderer.setStyle(
                this.el.nativeElement,
                'position',
                this.originalPosition,
            );
        }

        // Remove a classe de loading do elemento
        this.renderer.removeClass(this.el.nativeElement, 'is-loading');
    }
}
