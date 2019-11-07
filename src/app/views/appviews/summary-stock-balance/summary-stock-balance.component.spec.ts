import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryStockBalanceComponent } from './summary-stock-balance.component';

describe('SummaryStockBalanceComponent', () => {
  let component: SummaryStockBalanceComponent;
  let fixture: ComponentFixture<SummaryStockBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryStockBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryStockBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
