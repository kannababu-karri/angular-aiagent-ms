import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/jwt-payload.model';

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

  getUserId(): number {
    const userStr = sessionStorage.getItem('loggedInUser');
    if (!userStr) return 0;
    const user = JSON.parse(userStr);
    console.log('getUserId() - user object:', user);
    return user?.userId ?? null;
  }

  getUserName(): string {
    const userStr = sessionStorage.getItem('loggedInUser');
    if (!userStr) return '';
    const user = JSON.parse(userStr);
    console.log('getUserName() - user object:', user);
    return user?.userName ?? null;
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
    try {
      const token = this.getToken();
      if (!token) return [];
      
      const payload = jwtDecode<JwtPayload>(token);
      console.log('Decoded token payload:', payload);

      const roles: string[] = payload.roles || [];
      console.log('Decoded token payload roles:', roles);

      return roles

    } catch (error) {
      console.error('Token decode failed in getRoles():', error);
      return [];
    }
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  isAdmin(): boolean {
    try {
      const token = this.getToken();
      if (!token) return false;
      
      const payload = jwtDecode<JwtPayload>(token);
      console.log('Decoded token payload:', payload);

      const roles: string[] = payload.roles || [];
      console.log('Decoded token payload roles:', roles);

      return roles.map(r => r.toLowerCase()).includes('admin');

    } catch (error) {
      console.error('Token decode failed in isAdmin():', error);
      return false;
    }
  }

  isUser(): boolean {
   try {
      const token = this.getToken();
      if (!token) return false;
      
      const payload = jwtDecode<JwtPayload>(token);
      console.log('Decoded token payload:', payload);

      const roles: string[] = payload.roles || [];
      console.log('Decoded token payload roles:', roles);

      return roles.map(r => r.toLowerCase()).includes('user');

    } catch (error) {
      console.error('Token decode failed in isUser():', error);
      return false;
    }
  }


  isView(): boolean {
   try {
      const token = this.getToken();
      if (!token) return false;
      
      const payload = jwtDecode<JwtPayload>(token);
      console.log('Decoded token payload:', payload);

      const roles: string[] = payload.roles || [];
      console.log('Decoded token payload roles:', roles);

      return roles.map(r => r.toLowerCase()).includes('view');

    } catch (error) {
      console.error('Token decode failed in isView():', error);
      return false;
    }
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const payload: any = jwtDecode(token);

    if (!payload.exp) return false;

    return Date.now() < payload.exp * 1000;
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.userSubject.next(null);
  }

}
