import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveDepositListComponent } from './receive-deposit-list.component';

describe('ReceiveDepositListComponent', () => {
  let component: ReceiveDepositListComponent;
  let fixture: ComponentFixture<ReceiveDepositListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveDepositListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveDepositListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
