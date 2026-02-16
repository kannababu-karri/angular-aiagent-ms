import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHomeComponent } from './login-home.component';

describe('LoginHomeComponent', () => {
  let component: LoginHomeComponent;
  let fixture: ComponentFixture<LoginHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
