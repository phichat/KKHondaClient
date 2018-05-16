import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractStatusComponent } from './contract-status.component';

describe('ContractStatusComponent', () => {
  let component: ContractStatusComponent;
  let fixture: ComponentFixture<ContractStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
