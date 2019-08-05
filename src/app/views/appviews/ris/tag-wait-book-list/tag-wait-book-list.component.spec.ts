import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagWaitBookListComponent } from './tag-wait-book-list.component';

describe('TagWaitBookListComponent', () => {
  let component: TagWaitBookListComponent;
  let fixture: ComponentFixture<TagWaitBookListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagWaitBookListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagWaitBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
