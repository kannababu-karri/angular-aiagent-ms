import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerHome } from './manufacturer-home';

describe('ManufacturerHome', () => {
  let component: ManufacturerHome;
  let fixture: ComponentFixture<ManufacturerHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
