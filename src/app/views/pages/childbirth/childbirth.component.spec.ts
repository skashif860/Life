import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildbirthComponent } from './childbirth.component';

describe('ChildbirthComponent', () => {
  let component: ChildbirthComponent;
  let fixture: ComponentFixture<ChildbirthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildbirthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildbirthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
