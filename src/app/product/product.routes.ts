import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
        loadComponent: () =>
            import('./product-home/product-home.component')
                .then(m => m.ProductHomeComponent)
  },
  {
    path: 'add',
        loadComponent: () =>
            import('./product-add/product-add.component')
                .then(m => m.ProductAddComponent)
  },
  {
    path: 'update/:id',
        loadComponent: () =>
            import('./product-update/product-update.component')
                .then(m => m.ProductUpdateComponent)
  },
  {
    path: 'delete/:id',
        loadComponent: () =>
            import('./product-delete/product-delete.component')
                .then(m => m.ProductDeleteComponent)
  }
];