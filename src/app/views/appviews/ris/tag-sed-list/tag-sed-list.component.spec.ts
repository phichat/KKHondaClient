import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSedListComponent } from './tag-sed-list.component';

describe('TagSedListComponent', () => {
  let component: TagSedListComponent;
  let fixture: ComponentFixture<TagSedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagSedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
