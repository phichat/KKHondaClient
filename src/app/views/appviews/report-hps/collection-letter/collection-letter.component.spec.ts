import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionLetterComponent } from './collection-letter.component';

describe('CollectionLetterComponent', () => {
  let component: CollectionLetterComponent;
  let fixture: ComponentFixture<CollectionLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
