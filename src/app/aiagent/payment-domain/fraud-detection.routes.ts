import { Routes } from '@angular/router';

export const fraudDetectionRoutes: Routes = [
  {
    path: 'fraud-detection', loadComponent: () =>
            import('./fraud-detection/fraud-detection.component')
                .then(m => m.FraudDetectionComponent)
  }
];