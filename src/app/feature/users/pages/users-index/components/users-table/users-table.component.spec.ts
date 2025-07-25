import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableComponent } from './users-table.component';

describe('UsersTableComponent', () => {
    let component: UsersTableComponent;
    let fixture: ComponentFixture<UsersTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UsersTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
