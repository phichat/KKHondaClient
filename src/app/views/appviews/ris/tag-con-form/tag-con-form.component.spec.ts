import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagConFormComponent } from './tag-con-form.component';

describe('TagConFormComponent', () => {
  let component: TagConFormComponent;
  let fixture: ComponentFixture<TagConFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagConFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagConFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
