import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { menu } from './menu';
import { JsonPipe } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarMenuSectionComponent } from './sidebar-menu-section/sidebar-menu-section.component';

@Component({
    selector: 'app-sidebar',
    imports: [
        RouterLink,
        JsonPipe,
        NgbAccordionModule,
        SidebarMenuSectionComponent,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

    public readonly sections = menu;
}
