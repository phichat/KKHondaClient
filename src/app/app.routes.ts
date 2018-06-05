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
  ContractStatusComponent,
  CalculateListComponent
} from './views/appviews/credit';
import { ContractListComponent } from './views/appviews/credit/contract-list/contract-list.component';

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
      { path: 'contract-list', component: ContractListComponent },
      { path: 'calculate', component: CalculateComponent },
      { path: 'calculate-list', component: CalculateListComponent },
      { path: 'contract-field', component: ContractFieldComponent },
      { path: 'contract-status', component: ContractStatusComponent },
      { path: 'keeper', component: KeeperComponent },
    ]
  },

  // Handle all other routes
  { path: '**', redirectTo: 'starterview' }
];
