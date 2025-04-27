import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePartnershipComponent } from './update-partnership.component';

describe('UpdatePartnershipComponent', () => {
  let component: UpdatePartnershipComponent;
  let fixture: ComponentFixture<UpdatePartnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePartnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
