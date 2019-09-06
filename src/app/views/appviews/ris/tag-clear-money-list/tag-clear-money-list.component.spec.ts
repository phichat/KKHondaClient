import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagClearMoneyListComponent } from './tag-clear-money-list.component';

describe('TagClearMoneyListComponent', () => {
  let component: TagClearMoneyListComponent;
  let fixture: ComponentFixture<TagClearMoneyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagClearMoneyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagClearMoneyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
