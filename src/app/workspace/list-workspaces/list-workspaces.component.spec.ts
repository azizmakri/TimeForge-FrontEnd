import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkspacesComponent } from './list-workspaces.component';

describe('ListWorkspacesComponent', () => {
  let component: ListWorkspacesComponent;
  let fixture: ComponentFixture<ListWorkspacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListWorkspacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListWorkspacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
