import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisVehicleTaxComponent } from './regis-vehicle-tax.component';

describe('RegisVehicleTaxComponent', () => {
  let component: RegisVehicleTaxComponent;
  let fixture: ComponentFixture<RegisVehicleTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisVehicleTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisVehicleTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
