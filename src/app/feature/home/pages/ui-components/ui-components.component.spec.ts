import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiComponentsComponent } from './ui-components.component';

describe('UiComponentsComponent', () => {
    let component: UiComponentsComponent;
    let fixture: ComponentFixture<UiComponentsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiComponentsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UiComponentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
