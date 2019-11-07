import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteDetailsReportComponent } from './credit-note-details-report.component';

describe('CreditNoteDetailsReportComponent', () => {
  let component: CreditNoteDetailsReportComponent;
  let fixture: ComponentFixture<CreditNoteDetailsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditNoteDetailsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNoteDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
