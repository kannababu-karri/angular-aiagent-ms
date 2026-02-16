import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderqty } from './orderqty';

describe('Orderqty', () => {
  let component: Orderqty;
  let fixture: ComponentFixture<Orderqty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderqty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Orderqty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
