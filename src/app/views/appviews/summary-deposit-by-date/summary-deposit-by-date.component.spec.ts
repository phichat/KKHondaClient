import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDepositByDateComponent } from './summary-deposit-by-date.component';

describe('SummaryDepositByDateComponent', () => {
  let component: SummaryDepositByDateComponent;
  let fixture: ComponentFixture<SummaryDepositByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryDepositByDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryDepositByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
