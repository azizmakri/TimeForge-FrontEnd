import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartnershipComponent } from './partnership-list.component';

describe('PartnershipListComponent', () => {
  let component: ListPartnershipComponent;
  let fixture: ComponentFixture<ListPartnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPartnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
