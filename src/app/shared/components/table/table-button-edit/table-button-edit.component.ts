import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-table-button-edit',
    imports: [RouterLink],
    templateUrl: './table-button-edit.component.html',
    styleUrl: './table-button-edit.component.scss',
})
export class TableButtonEditComponent {
    readonly title = input<string>('Alterar registro');
    readonly url = input.required<string | readonly any[]>();
}
