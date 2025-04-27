import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalCalendarComponent } from './goal-calendar.component';

describe('GoalCalendarComponent', () => {
  let component: GoalCalendarComponent;
  let fixture: ComponentFixture<GoalCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
