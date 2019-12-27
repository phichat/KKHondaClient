import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateListComponent } from './calculate-list.component';

describe('CalculateListComponent', () => {
  let component: CalculateListComponent;
  let fixture: ComponentFixture<CalculateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
