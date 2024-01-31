import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingShiftComponent } from './upcoming-shift.component';

describe('UpcomingShiftComponent', () => {
  let component: UpcomingShiftComponent;
  let fixture: ComponentFixture<UpcomingShiftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingShiftComponent]
    });
    fixture = TestBed.createComponent(UpcomingShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
