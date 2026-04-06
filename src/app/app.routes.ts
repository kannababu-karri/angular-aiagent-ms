import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent 
    }, // DEFAULT

    { 
        path: 'login', component: LoginComponent 
    },

    { 
        path: 'login-home', loadComponent: () =>
            import('./login-home/login-home.component')
                .then(l => l.LoginHomeComponent)
    },

    {
        path: 'manufacturer',
            loadChildren: () => import('./manufacturer/manufacturer.routes')
                .then(m => m.manufacturerRoutes)
    },

    {
        path: 'product',
            loadChildren: () => import('./product/product.routes')
                .then(p => p.productRoutes)
    },

    {
        path: 'orderqty',
            loadChildren: () => import('./orderqty/orderqty.routes')
                .then(p => p.orderqtyRoutes)
    },

    {
        path: 'orderdocument',
            loadChildren: () => import('./orderdocument/orderdocument.routes')
                .then(p => p.orderdocumentRoutes)
    },

    {
        path: 'regulatorycompliance',
            loadChildren: () => import('./aiagent/regulatory-compliance/regulatory-compliance.routes')
                .then(p => p.regulatoryComplianceRoutes)
    },

    {
        path: 'medirag',
            loadChildren: () => import('./aiagent/medi-rag/medi-rag.routes')
                .then(p => p.mediRagRoutes)
    },

    {
        path: 'paymentdomain',
            loadChildren: () => import('./aiagent/payment-domain/fraud-detection.routes')
                .then(p => p.fraudDetectionRoutes)
    },

    {
        path: 'circuitbreakerdemo', loadComponent: () =>  
                import('./circuit-breaker/circuit-breaker.component') 
                    .then(m => m.CircuitBreakerComponent)
    },

    {
        path: 'doctor-appointment', loadComponent: () =>  
                import('./chat-appointment/chat.appointment.component') 
                    .then(m => m.ChatAppointmentComponent)
    },
    {
        path: 'doctor-llm-appointment', loadComponent: () =>  
                import('./chat-appointment/chat.llm.appoint.component') 
                    .then(m => m.ChatLlmAppointmentComponent)
    },

    { 
        path: '**', redirectTo: 'login' 
    }
];
