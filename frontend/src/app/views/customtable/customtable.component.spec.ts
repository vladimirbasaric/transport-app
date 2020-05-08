import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomtableComponent } from './customtable.component';

describe('CustomtableComponent', () => {
  let component: CustomtableComponent;
  let fixture: ComponentFixture<CustomtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomtableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
