import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-auth',
    imports: [
        RouterOutlet,
        HeaderComponent,
        SidebarComponent,
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
})
export class AuthComponent {

    public sidebarOpened = signal(true);
}
