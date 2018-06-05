import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractStatusListComponent } from './contract-status-list.component';

describe('ContractStatusListComponent', () => {
  let component: ContractStatusListComponent;
  let fixture: ComponentFixture<ContractStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
