import {
    Directive,
    ElementRef,
    OnInit,
    Renderer2,
    inject,
} from '@angular/core';

@Directive({
    selector: 'input[type="password"][appInputPassword]',
})
export class InputPasswordDirective implements OnInit {
    private readonly el = inject(ElementRef<HTMLInputElement>);
    private readonly renderer = inject(Renderer2);

    private wrapperDiv!: HTMLDivElement;
    private toggleButton!: HTMLButtonElement;
    private isPasswordVisible = false;

    ngOnInit(): void {
        this.createPasswordToggle();
    }

    private createPasswordToggle(): void {
        const inputElement = this.el.nativeElement;
        const parentElement = inputElement.parentElement;

        if (!parentElement) return;

        // Cria a div wrapper com posição relativa
        this.wrapperDiv = this.renderer.createElement('div');
        this.renderer.addClass(this.wrapperDiv, 'position-relative');
        this.renderer.addClass(this.wrapperDiv, 'input-password-wrapper');

        // Insere a div wrapper antes do input
        this.renderer.insertBefore(
            parentElement,
            this.wrapperDiv,
            inputElement
        );

        // Move o input para dentro da div wrapper
        this.renderer.appendChild(this.wrapperDiv, inputElement);

        // Cria o botão toggle
        this.createToggleButton();
    }

    private createToggleButton(): void {
        this.toggleButton = this.renderer.createElement('button');

        var inputHeight = this.el.nativeElement.offsetHeight;

        this.renderer.setStyle(this.toggleButton, 'height', `${inputHeight}px`);
        this.renderer.setStyle(this.toggleButton, 'width', `${inputHeight}px`);

        // Atributos do botão
        this.renderer.setAttribute(this.toggleButton, 'type', 'button');
        this.renderer.setAttribute(this.toggleButton, 'tabindex', '-1');
        this.renderer.addClass(this.toggleButton, 'btn');
        this.renderer.addClass(this.toggleButton, 'btn-link');
        this.renderer.addClass(this.toggleButton, 'bg-transparent');
        this.renderer.addClass(this.toggleButton, 'position-absolute');
        this.renderer.addClass(this.toggleButton, 'top-0');
        this.renderer.addClass(this.toggleButton, 'end-0');
        this.renderer.addClass(this.toggleButton, 'border-0');
        this.renderer.addClass(this.toggleButton, 'mx-1');

        // Adiciona padding-right ao input para não sobrepor o ícone
        this.renderer.setStyle(this.el.nativeElement, 'padding-right', '3rem');

        // Cria o ícone inicial (olho fechado)
        this.updateToggleIcon();

        // Adiciona o event listener para o clique
        this.renderer.listen(this.toggleButton, 'click', () => {
            this.togglePasswordVisibility();
        });

        // Adiciona o botão à div wrapper
        this.renderer.appendChild(this.wrapperDiv, this.toggleButton);
    }

    private updateToggleIcon(): void {
        // Remove ícone anterior se existir
        this.toggleButton.innerHTML = '';

        // Cria o novo ícone
        const icon = this.renderer.createElement('i');

        if (this.isPasswordVisible) {
            this.renderer.addClass(icon, 'fal');
            this.renderer.addClass(icon, 'fa-eye-slash');
            this.renderer.setAttribute(
                this.toggleButton,
                'title',
                'Ocultar senha'
            );
        } else {
            this.renderer.addClass(icon, 'fal');
            this.renderer.addClass(icon, 'fa-eye');
            this.renderer.setAttribute(
                this.toggleButton,
                'title',
                'Mostrar senha'
            );
        }

        this.renderer.appendChild(this.toggleButton, icon);
    }

    private togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;

        // Altera o type do input
        const newType = this.isPasswordVisible ? 'text' : 'password';
        this.renderer.setAttribute(this.el.nativeElement, 'type', newType);

        // Atualiza o ícone
        this.updateToggleIcon();

        // Mantém o foco no input
        this.el.nativeElement.focus();
    }
}
