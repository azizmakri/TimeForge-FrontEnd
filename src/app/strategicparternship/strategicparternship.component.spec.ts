import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicparternshipComponent } from './strategicparternship.component';

describe('StrategicparternshipComponent', () => {
  let component: StrategicparternshipComponent;
  let fixture: ComponentFixture<StrategicparternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategicparternshipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategicparternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
