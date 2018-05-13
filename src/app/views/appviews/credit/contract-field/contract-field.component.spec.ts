import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractFieldComponent } from './contract-field.component';

describe('ContractFieldComponent', () => {
  let component: ContractFieldComponent;
  let fixture: ComponentFixture<ContractFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
