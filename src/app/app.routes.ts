import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/leadscoregen' },
  { path: 'leadscoregen', loadComponent: () => import('./pages/leadscoregenerator/leadscoregenerator.component').then(m => m.LeadscoregeneratorComponent) }
];
