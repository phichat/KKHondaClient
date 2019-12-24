import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McsReportReceiveComponent } from './mcs-report-receive.component';

describe('McsReportReceiveComponent', () => {
  let component: McsReportReceiveComponent;
  let fixture: ComponentFixture<McsReportReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McsReportReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McsReportReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
