import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagClListComponent } from './tag-cl-list.component';

describe('TagClListComponent', () => {
  let component: TagClListComponent;
  let fixture: ComponentFixture<TagClListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagClListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagClListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
