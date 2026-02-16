import { Routes } from '@angular/router';

export const manufacturerRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/manufacturer-home/manufacturer-home.component')
        .then(m => m.ManufacturerHomeComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/manufacturer-add/manufacturer-add.component')
        .then(m => m.ManufacturerAddComponent)
  },
  {
    path: 'update',
    loadComponent: () =>
      import('./components/manufacturer-update/manufacturer-update.component')
        .then(m => m.ManufacturerUpdateComponent)
  },
  {
    path: 'delete',
    loadComponent: () =>
      import('./components/manufacturer-delete/manufacturer-delete.component')
        .then(m => m.ManufacturerDeleteComponent)
  }
];