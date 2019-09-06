import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSedFormComponent } from './tag-sed-form.component';

describe('TagSedFormComponent', () => {
  let component: TagSedFormComponent;
  let fixture: ComponentFixture<TagSedFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagSedFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
