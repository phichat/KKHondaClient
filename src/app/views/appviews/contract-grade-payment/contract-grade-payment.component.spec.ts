import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractGradePaymentComponent } from './contract-grade-payment.component';

describe('ContractGradePaymentComponent', () => {
  let component: ContractGradePaymentComponent;
  let fixture: ComponentFixture<ContractGradePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractGradePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractGradePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
