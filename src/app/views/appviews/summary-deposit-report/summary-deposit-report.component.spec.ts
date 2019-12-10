import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDepositReportComponent } from './summary-deposit-report.component';

describe('SummaryDepositReportComponent', () => {
  let component: SummaryDepositReportComponent;
  let fixture: ComponentFixture<SummaryDepositReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryDepositReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryDepositReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
