import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictWorkflowComponent } from './predict-workflow.component';

describe('PredictWorkflowComponent', () => {
  let component: PredictWorkflowComponent;
  let fixture: ComponentFixture<PredictWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredictWorkflowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
