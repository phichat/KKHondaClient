import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagConcludeFormComponent } from './tag-conclude-form.component';

describe('TagConcludeFormComponent', () => {
  let component: TagConcludeFormComponent;
  let fixture: ComponentFixture<TagConcludeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagConcludeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagConcludeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
