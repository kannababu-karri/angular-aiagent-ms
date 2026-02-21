import { Routes } from '@angular/router';

export const manufacturerRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./manufacturer-home/manufacturer-home.component')
        .then(m => m.ManufacturerHomeComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./manufacturer-add/manufacturer-add.component')
        .then(m => m.ManufacturerAddComponent)
  },
  {
    path: 'update/:id',
    loadComponent: () =>
      import('./manufacturer-update/manufacturer-update.component')
        .then(m => m.ManufacturerUpdateComponent)
  },
  {
    path: 'delete/:id',
    loadComponent: () =>
      import('./manufacturer-delete/manufacturer-delete.component')
        .then(m => m.ManufacturerDeleteComponent)
  }
];