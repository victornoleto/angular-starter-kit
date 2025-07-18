import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-auth',
    imports: [RouterOutlet, HeaderComponent, SidebarComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
    public sidebarToggled = signal(false);

    protected toggleSidebarState(): void {
        this.sidebarToggled.update((current) => !current);
    }

    protected setSidebarState(state: boolean): void {
        this.sidebarToggled.set(state);
    }
}
