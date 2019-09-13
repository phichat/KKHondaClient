import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisTagComponent } from './regis-tag.component';

describe('RegisTagComponent', () => {
  let component: RegisTagComponent;
  let fixture: ComponentFixture<RegisTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
