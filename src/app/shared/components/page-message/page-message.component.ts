import { Component, input } from '@angular/core';

@Component({
    selector: 'app-page-message',
    imports: [],
    templateUrl: './page-message.component.html',
    styleUrl: './page-message.component.scss',
})
export class PageMessageComponent {
    public icon = input<string>('🤔');
    public message = input.required<string>();
    public details = input<string>();
}
