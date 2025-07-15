import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMenuSectionComponent } from './sidebar-menu-section.component';

describe('SidebarMenuSectionComponent', () => {
  let component: SidebarMenuSectionComponent;
  let fixture: ComponentFixture<SidebarMenuSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarMenuSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarMenuSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
