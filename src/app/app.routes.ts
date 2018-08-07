import { Routes } from '@angular/router';

import { StarterViewComponent } from './views/appviews/starterview.component';
import { LoginComponent } from './views/appviews/login.component';
import { BasicLayoutComponent } from './components/common/layouts/basicLayout.component';
import {
  ContractComponent,
  CalculateComponent,
  ContractDetailComponent
} from './views/appviews/credit';
import { ContractListActiveComponent } from './views/appviews/credit/contract-list/contract-list-active.component';
import { ContractListCanceledComponent } from './views/appviews/credit/contract-list/contract-list-canceled.component';
import { RptSummaryCloseContractComponent } from './views/appviews/credit/rpt-summary-close-contract/rpt-summary-close-contract.component';
import { BookingComponent } from './views/dashboards/booking/booking.component';

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'starterview', pathMatch: 'full' },

  // Dashboard
  {
    path: 'dashboards', component: BasicLayoutComponent,
    children: [
      { path: 'booking', component: BookingComponent }
    ]
  },

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
      {
        path: 'contract-list',
        children: [
          { path: 'active', component: ContractListActiveComponent },
          { path: 'canceled', component: ContractListCanceledComponent }
        ]
      },
      { path: 'detail', component: ContractDetailComponent },
      { path: 'calculate', component: CalculateComponent },
      { path: 'rpt-sum-close-contract', component: RptSummaryCloseContractComponent }
    ]
  },

  // Handle all other routes
  { path: '**', redirectTo: 'starterview' }
];
