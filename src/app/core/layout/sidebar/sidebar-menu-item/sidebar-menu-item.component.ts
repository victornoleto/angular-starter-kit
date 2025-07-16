import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from '../menu';

@Component({
    selector: 'app-sidebar-menu-item',
    imports: [RouterLink, NgbAccordionModule],
    templateUrl: './sidebar-menu-item.component.html',
    styleUrl: '../sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SidebarMenuItemComponent {
    private readonly router = inject(Router);

    readonly item = input.required<MenuItem>();
    readonly level = input<number>(0);

    // Signal reativo para a rota atual
    private readonly currentRoute = signal(this.router.url);

    protected readonly isActive = computed(() => {
        const route = this.currentRoute();
        const itemLink = this.item().link;
        const children = this.item().children || [];
        
        const isCurrentRoute = route === itemLink;
        const hasActiveChild = this.checkChildren(route, children);
        
        return isCurrentRoute || hasActiveChild;
    });

    constructor() {
        // Escuta mudanças de navegação e atualiza o signal
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed()
            )
            .subscribe((event: NavigationEnd) => {
                this.currentRoute.set(event.url);
            });
    }

    private checkChildren(route: string, children: MenuItem[]): boolean {
        return children.some(
            (child) =>
                child.link === route ||
                (child.children && this.checkChildren(route, child.children)),
        );
    }
}
