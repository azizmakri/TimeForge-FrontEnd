import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowCalendarComponent } from './workflow-calendar.component';

describe('WorkflowCalendarComponent', () => {
  let component: WorkflowCalendarComponent;
  let fixture: ComponentFixture<WorkflowCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
