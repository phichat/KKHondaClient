import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySaleReportByTypeComponent } from './summary-sale-report-by-type.component';

describe('SummarySaleReportByTypeComponent', () => {
  let component: SummarySaleReportByTypeComponent;
  let fixture: ComponentFixture<SummarySaleReportByTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarySaleReportByTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySaleReportByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
