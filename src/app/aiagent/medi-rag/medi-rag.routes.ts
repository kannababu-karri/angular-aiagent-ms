import { Routes } from '@angular/router';

export const mediRagRoutes: Routes = [
  {
    path: 'medirag-process', loadComponent: () =>
            import('./medirag-process/medirag-process.component')
                .then(m => m.MediragProcessComponent)
  },
  {
    path: 'medirag-chatbot', loadComponent: () =>
            import('./medirag-chatbot/medirag-chatbot.component')
                .then(m => m.MediragChatbotComponent)  
  }
];