import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotobikeComponent } from './motobike.component';

describe('MotobikeComponent', () => {
  let component: MotobikeComponent;
  let fixture: ComponentFixture<MotobikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotobikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotobikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
