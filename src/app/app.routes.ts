import { Routes } from '@angular/router';

import { StarterViewComponent } from './views/appviews/starterview.component';
import { LoginComponent } from './views/appviews/login.component';
import { BasicLayoutComponent } from './components/common/layouts/basicLayout.component';
import {
  ContractComponent,
  CalculateComponent,
  ContractDetailComponent,
  ContractCanceledComponent
} from './views/appviews/credit';
import { ContractListActiveComponent } from './views/appviews/credit/contract-list/contract-list-active.component';
import { ContractListCanceledComponent } from './views/appviews/credit/contract-list/contract-list-canceled.component';
import { RptSummaryCloseContractComponent } from './views/appviews/credit/rpt-summary-close-contract/rpt-summary-close-contract.component';
import { BookingComponent } from './views/dashboards/booking/booking.component';
import { PaymentComponent } from './views/appviews/credit/payment/payment.component';
import { ContractListCloseContractComponent } from './views/appviews/credit/contract-list/contract-list-close-contract.component';
import { ContractListOtherContractComponent } from './views/appviews/credit/contract-list/contract-list-other-contract.component';
import { GuardGuard } from 'app/guards/guard.guard';
import { ReportBookingComponent } from './views/appviews/report-booking/report-booking.component';

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
      // { path: 'login', component: LoginComponent },
    ]
  },
  {
    path: 'credit', component: BasicLayoutComponent,
    children: [
      { path: 'contract', component: ContractComponent, canActivate: [GuardGuard] },
      { path: 'contract-canceled', component: ContractCanceledComponent, canActivate: [GuardGuard] },
      {
        path: 'contract-list',
        children: [
          { path: 'active', component: ContractListActiveComponent, canActivate: [GuardGuard] },
          // { path: 'canceled', component: ContractListCanceledComponent },
          { path: 'close-contract', component: ContractListCloseContractComponent, canActivate: [GuardGuard] },
          { path: 'other-contract', component: ContractListOtherContractComponent, canActivate: [GuardGuard] }
        ]
      },
      { path: 'detail', component: ContractDetailComponent, canActivate: [GuardGuard] },
      { path: 'calculate', component: CalculateComponent, canActivate: [GuardGuard] },
      { path: 'rpt-sum-close-contract', component: RptSummaryCloseContractComponent, canActivate: [GuardGuard] },
      { path: 'payment/:id', component: PaymentComponent, canActivate: [GuardGuard] }
    ]
  },
  {
    path: 'report', component: BasicLayoutComponent,
    children: [
      { path: 'booking', component: ReportBookingComponent }
    ]
  },

  // Handle all other routes
  { path: '**', redirectTo: 'starterview' }
];
