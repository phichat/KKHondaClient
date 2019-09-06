import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagHistoryCarComponent } from './tag-history-car.component';

describe('TagHistoryCarComponent', () => {
  let component: TagHistoryCarComponent;
  let fixture: ComponentFixture<TagHistoryCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagHistoryCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagHistoryCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
