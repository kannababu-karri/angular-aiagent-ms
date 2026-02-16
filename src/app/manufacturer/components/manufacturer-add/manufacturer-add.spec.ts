import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerAdd } from './manufacturer-add.component';

describe('ManufacturerAdd', () => {
  let component: ManufacturerAdd;
  let fixture: ComponentFixture<ManufacturerAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
