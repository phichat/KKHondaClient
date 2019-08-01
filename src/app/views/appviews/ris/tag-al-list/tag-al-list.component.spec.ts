import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagAlListComponent } from './tag-al-list.component';

describe('TagAlListComponent', () => {
  let component: TagAlListComponent;
  let fixture: ComponentFixture<TagAlListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagAlListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagAlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
