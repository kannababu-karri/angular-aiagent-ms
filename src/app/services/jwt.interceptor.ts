import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const authService = inject(AuthService); // inject services in functional interceptors
    const token = authService.getToken();
    const router = inject(Router);
    console.log('JWT Interceptor: token 1:', token);

    if (token) {
          req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    console.log('JWT Interceptor: request with token:', req.headers.get('Authorization'));
    //return next(req);
    // ✅ Handle response errors (IMPORTANT)
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            if (error.status === 401) {
                console.log("Session expired or unauthorized");

                // Clear session
                authService.logout(); // recommended instead of manual clear

                // Redirect to login
                router.navigate(['/login']);
            }

            return throwError(() => error);
        })
    );
};