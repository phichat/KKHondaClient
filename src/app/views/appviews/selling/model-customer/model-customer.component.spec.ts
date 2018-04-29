import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCustomerComponent } from './model-customer.component';

describe('ModelCustomerComponent', () => {
  let component: ModelCustomerComponent;
  let fixture: ComponentFixture<ModelCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
