import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagConListComponent } from './tag-con-list.component';

describe('TagConListComponent', () => {
  let component: TagConListComponent;
  let fixture: ComponentFixture<TagConListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagConListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagConListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
