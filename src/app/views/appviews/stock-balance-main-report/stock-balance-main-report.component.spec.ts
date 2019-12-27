import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBalanceMainReportComponent } from './stock-balance-main-report.component';

describe('StockBalanceMainReportComponent', () => {
  let component: StockBalanceMainReportComponent;
  let fixture: ComponentFixture<StockBalanceMainReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBalanceMainReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBalanceMainReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
