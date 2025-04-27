import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicPartenershipCalendarComponent } from './strategic-partenership-calendar.component';

describe('StrategicPartenershipCalendarComponent', () => {
  let component: StrategicPartenershipCalendarComponent;
  let fixture: ComponentFixture<StrategicPartenershipCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategicPartenershipCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategicPartenershipCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
