import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerDelete } from './manufacturer-delete.component';

describe('ManufacturerDelete', () => {
  let component: ManufacturerDelete;
  let fixture: ComponentFixture<ManufacturerDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
