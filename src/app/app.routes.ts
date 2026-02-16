import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // DEFAULT

  { path: 'login', component: LoginComponent },

  { 
    path: 'login-home', loadComponent: () =>
      import('./login-home/login-home.component')
      .then(m => m.LoginHomeComponent)
  },
  {
    path: 'manufacturer',
    loadChildren: () => import('./manufacturer/manufacturer.routes')
        .then(m => m.manufacturerRoutes)
},
  { path: '**', redirectTo: 'login' }
];
