import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { ManufacturerService } from './services/manufacturer.service';
import { routes } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,          // ✅ must be imported
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AppComponent,              // ✅ standalone components can go here
    LoginComponent
  ],
  providers: [
    AuthService,
    ManufacturerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
