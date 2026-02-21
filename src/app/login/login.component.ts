import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {

  protected readonly title = signal('Angular-Microservices Application: Login');
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, 
              private http: HttpClient,
              private router: Router,
              public authService: AuthService) {

    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      console.log('Login submitted:', credentials);

      const apiUserUrl = this.http.get(`${environment.apiUser}/validate/user`);
      console.log('apiUserUrl details:', apiUserUrl);

      this.http.get<any>(
            `${environment.apiUser}/validate/user`,
            {
              params: {
                username: credentials.userName,
                password: credentials.password
              }
            }
          ).subscribe({
            next: (response: any) => {
              console.log('Login success:', response);
              this.errorMessage.set('');
              // 1️. Save user object in sessionStorage
              //sessionStorage.setItem('loggedInUser', JSON.stringify(response));
              this.authService.saveUser(response);

              console.log('response.token:', response.token);

              this.authService.setToken(response.token); // Save JWT token

              // 3️⃣ Navigate to login home component
              this.router.navigate(['/login-home']);
            },
            error: (err: HttpErrorResponse) => {
              console.log(err.status);        // 401
              console.log(err.error);         // backend message
              console.log(err.error.message); // if JSON

              console.error('Login failed:', err);
              this.errorMessage.set('Invalid username or password');
              this.successMessage.set('');
            }
          });

      this.errorMessage.set(''); // clear error
    } else {
      this.errorMessage.set('Please fill all required fields');
    }
  }

  onReset() {
    this.loginForm.reset();
    this.errorMessage.set('');
    this.successMessage.set('');
  }

}
