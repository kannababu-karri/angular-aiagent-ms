import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerUpdate } from './manufacturer-update.component';

describe('ManufacturerUpdate', () => {
  let component: ManufacturerUpdate;
  let fixture: ComponentFixture<ManufacturerUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
