import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFiltersComponent } from './users-filters.component';

describe('UsersFiltersComponent', () => {
    let component: UsersFiltersComponent;
    let fixture: ComponentFixture<UsersFiltersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersFiltersComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UsersFiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
