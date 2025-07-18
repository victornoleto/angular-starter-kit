import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarMenuItemComponent } from './sidebar-menu-item/sidebar-menu-item.component';
import { menu } from './menu';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, NgbAccordionModule, SidebarMenuItemComponent],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    protected readonly sections = menu;

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
