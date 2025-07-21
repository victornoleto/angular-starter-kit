import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLoadingComponent } from './table-loading.component';

describe('TableLoadingComponent', () => {
  let component: TableLoadingComponent;
  let fixture: ComponentFixture<TableLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
