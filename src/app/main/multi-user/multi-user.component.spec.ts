import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiUserComponent } from './multi-user.component';

describe('MultiUserComponent', () => {
  let component: MultiUserComponent;
  let fixture: ComponentFixture<MultiUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
