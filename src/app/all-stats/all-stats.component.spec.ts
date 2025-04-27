import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStatsComponent } from './all-stats.component';

describe('AllStatsComponent', () => {
  let component: AllStatsComponent;
  let fixture: ComponentFixture<AllStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
