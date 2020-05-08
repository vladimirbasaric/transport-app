import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClientTourComponent } from './new-client-tour.component';

describe('NewClientTourComponent', () => {
  let component: NewClientTourComponent;
  let fixture: ComponentFixture<NewClientTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewClientTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClientTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
