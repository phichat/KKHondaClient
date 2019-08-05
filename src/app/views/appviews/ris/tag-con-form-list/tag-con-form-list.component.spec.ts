import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagConFormListComponent } from './tag-con-form-list.component';

describe('TagConFormListComponent', () => {
  let component: TagConFormListComponent;
  let fixture: ComponentFixture<TagConFormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagConFormListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagConFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
