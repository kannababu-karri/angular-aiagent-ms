import { Routes } from '@angular/router';

export const orderdocumentRoutes: Routes = [
  {
    path: '',
        loadComponent: () =>
            import('./orderdocument-home.component')
                .then(m => m.OrderdocumentHomeComponent)
  }
];