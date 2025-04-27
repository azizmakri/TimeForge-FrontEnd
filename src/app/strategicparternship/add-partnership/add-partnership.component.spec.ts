import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartnershipComponent } from './add-partnership.component';

describe('AddPartnershipComponent', () => {
  let component: AddPartnershipComponent;
  let fixture: ComponentFixture<AddPartnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPartnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
