import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicPartenershipStatsComponent } from './strategic-partenership-stats.component';

describe('StrategicPartenershipStatsComponent', () => {
  let component: StrategicPartenershipStatsComponent;
  let fixture: ComponentFixture<StrategicPartenershipStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategicPartenershipStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategicPartenershipStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
