import { Routes } from '@angular/router';

export const orderqtyRoutes: Routes = [
  {
    path: '',
        loadComponent: () =>
            import('./orderqty-home/orderqty-home.component')
                .then(m => m.OrderqtyHomeComponent)
  },
  {
    path: 'add',
        loadComponent: () =>
            import('./orderqty-add/orderqty-add.component')
                .then(m => m.OrderqtyAddComponent)
  },
  {
    path: 'update/:id',
        loadComponent: () =>
            import('./orderqty-update/orderqty-update.component')
                .then(m => m.OrderqtyUpdateComponent)
  },
  {
    path: 'delete/:id',
        loadComponent: () =>
            import('./orderqty-delete/orderqty-delete.component')
                .then(m => m.OrderqtyDeleteComponent)
  }
];