import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McsReportTaxPoComponent } from './mcs-report-tax-po.component';

describe('McsReportTaxPoComponent', () => {
  let component: McsReportTaxPoComponent;
  let fixture: ComponentFixture<McsReportTaxPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McsReportTaxPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McsReportTaxPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
