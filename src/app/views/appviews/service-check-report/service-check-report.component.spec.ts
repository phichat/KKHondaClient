import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCheckReportComponent } from './service-check-report.component';

describe('ServiceCheckReportComponent', () => {
  let component: ServiceCheckReportComponent;
  let fixture: ComponentFixture<ServiceCheckReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCheckReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCheckReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
