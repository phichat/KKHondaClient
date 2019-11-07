import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSellingProfitReportComponent } from './product-selling-profit-report.component';

describe('ProductSellingProfitReportComponent', () => {
  let component: ProductSellingProfitReportComponent;
  let fixture: ComponentFixture<ProductSellingProfitReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSellingProfitReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSellingProfitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
