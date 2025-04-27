import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalStatsComponent } from './goal-stats.component';

describe('GoalStatsComponent', () => {
  let component: GoalStatsComponent;
  let fixture: ComponentFixture<GoalStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
