import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractFieldListComponent } from './contract-field-list.component';

describe('ContractFieldListComponent', () => {
  let component: ContractFieldListComponent;
  let fixture: ComponentFixture<ContractFieldListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractFieldListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractFieldListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
