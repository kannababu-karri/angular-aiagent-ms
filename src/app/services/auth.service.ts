import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private tokenKey = 'jwtToken';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();


  saveUser(user: any) {
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): any {
    const user = sessionStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  loadUser() {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clear() {
    sessionStorage.clear();
  }

  getRoles(): string[] {
    //const token = localStorage.getItem('token');
    const token = this.getToken();
    if (!token) return [];

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }


  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // Optional: decode JWT and check role, e.g., using jwt-decode library
    return token.includes('admin'); // simple example
  }

  isUser(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // Optional: decode JWT and check role, e.g., using jwt-decode library
    return token.includes('user'); // simple example
  }


  isView(): boolean {
     const token = this.getToken();
    if (!token) return false;
    // Optional: decode JWT and check role, e.g., using jwt-decode library
    return token.includes('view'); // simple example
  }
}
