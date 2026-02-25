import { Routes } from '@angular/router';

export const regulatoryComplianceRoutes: Routes = [
  {
    path: 'dashboard', loadComponent: () =>
            import('./rc-dashboard/rc-dashboard.component')
                .then(m => m.RCDashboardComponent)
  },
  {
    path: 'rc-process', loadComponent: () =>
            import('./rc-process/rc-process.component')
                .then(m => m.RcProcessComponent)  
  }
];