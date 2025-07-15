import { Component, input } from '@angular/core';
import { MenuSection } from '../menu';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-sidebar-menu-section',
    imports: [
        JsonPipe,
    ],
    templateUrl: './sidebar-menu-section.component.html',
    styleUrl: './sidebar-menu-section.component.scss'
})
export class SidebarMenuSectionComponent {

    public section = input.required<MenuSection>();
}
