import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotobikeDetailComponent } from './motobike-detail.component';

describe('MotobikeDetailComponent', () => {
  let component: MotobikeDetailComponent;
  let fixture: ComponentFixture<MotobikeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotobikeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotobikeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
