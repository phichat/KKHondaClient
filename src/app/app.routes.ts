import { Routes } from '@angular/router';

import { StarterViewComponent } from './views/appviews/starterview.component';
import { LoginComponent } from './views/appviews/login.component';

import { BlankLayoutComponent } from './components/common/layouts/blankLayout.component';
import { BasicLayoutComponent } from './components/common/layouts/basicLayout.component';
import { TopNavigationLayoutComponent } from './components/common/layouts/topNavigationlayout.component';
import {
  ContractComponent,
  CalculateComponent,
  KeeperComponent,
  ContractFieldComponent,
  ContractStatusComponent
} from './views/appviews/credit';

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'starterview', pathMatch: 'full' },

  // App views
  {
    path: '', component: BasicLayoutComponent,
    children: [
      { path: 'starterview', component: StarterViewComponent },
      { path: 'login', component: LoginComponent },
    ]
  },
  {
    path: 'credit', component: BasicLayoutComponent,
    children: [
      { path: 'contract', component: ContractComponent },
      { path: 'calculate', component: CalculateComponent },
      { path: 'contract-field', component: ContractFieldComponent },
      { path: 'contract-status', component: ContractStatusComponent },
      { path: 'keeper', component: KeeperComponent },
    ]
  },

  // Handle all other routes
  { path: '**', redirectTo: 'starterview' }
];
