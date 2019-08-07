import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagBookWaitingListComponent } from './tag-book-waiting-list.component';

describe('TagBookWaitingListComponent', () => {
  let component: TagBookWaitingListComponent;
  let fixture: ComponentFixture<TagBookWaitingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagBookWaitingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagBookWaitingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
