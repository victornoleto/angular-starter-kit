import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';

@Component({
    selector: 'app-header',
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    public sidebarToggled = input<boolean>(false);

    public toggleSidebarState = output<void>();
    public setSidebarState = output<boolean>();

    protected onToggleSidebarState(): void {
        this.toggleSidebarState.emit();
    }

    protected onSetSidebarState(state: boolean): void {
        this.setSidebarState.emit(state);
    }
}
