import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './app/services/jwt.interceptor';
import { AuthService } from './app/services/auth.service';
import { ManufacturerService } from './app/services/manufacturer.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    AuthService,
    ManufacturerService
  ]
}).catch(err => console.error(err));