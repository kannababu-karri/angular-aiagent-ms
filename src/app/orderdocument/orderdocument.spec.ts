import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderdocument } from './orderdocument';

describe('Orderdocument', () => {
  let component: Orderdocument;
  let fixture: ComponentFixture<Orderdocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderdocument]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Orderdocument);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
