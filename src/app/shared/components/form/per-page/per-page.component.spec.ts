import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerPageComponent } from './per-page.component';

describe('PerPageComponent', () => {
    let component: PerPageComponent;
    let fixture: ComponentFixture<PerPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PerPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
