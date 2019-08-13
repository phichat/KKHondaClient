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
import { ReportCreditNoteComponent } from './views/appviews/report-credit-note/report-credit-note.component';
import { ReportSaleComponent } from './views/appviews/report-sale/report-sale.component';
import { TagSedFormComponent } from './views/appviews/ris/tag-sed-form/tag-sed-form.component';
import { TagClFormComponent } from './views/appviews/ris/tag-cl-form/tag-cl-form.component';
import { TagAlFormComponent } from './views/appviews/ris/tag-al-form/tag-al-form.component';
import { TagAlListComponent } from './views/appviews/ris/tag-al-list/tag-al-list.component';
import { TagClListComponent } from './views/appviews/ris/tag-cl-list/tag-cl-list.component';
import { TagSedListComponent } from './views/appviews/ris/tag-sed-list/tag-sed-list.component';
import { TagSedFormDetailComponent } from './views/appviews/ris/tag-sed-form/tag-sed-form-detail.component';
import { TagAlFormDetailComponent } from './views/appviews/ris/tag-al-form/tag-al-form-detail.component';
import { TagClFormDetailComponent } from './views/appviews/ris/tag-cl-form/tag-cl-form-detail.component';
import { TagConListComponent } from './views/appviews/ris/tag-con-list/tag-con-list.component';
import { TagConFormComponent } from './views/appviews/ris/tag-con-form/tag-con-form.component';
import { TagConFormDetailComponent } from './views/appviews/ris/tag-con-form/tag-con-form-detail.component';
import { TagBookWaitingListComponent } from './views/appviews/ris/tag-book-waiting-list/tag-book-waiting-list.component';
import { TagConFormEditComponent } from './views/appviews/ris/tag-con-form/tag-con-form-edit.component';

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
          { path: 'canceled', component: ContractListCanceledComponent },
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
      { path: 'booking', component: ReportBookingComponent },
      { path: 'credit-note', component: ReportCreditNoteComponent },
      { path: 'sale-report', component: ReportSaleComponent }
    ]
  },
  {
    path: 'ris', component: BasicLayoutComponent,
    children: [
      { path: 'waiting-tag-list', component: TagBookWaitingListComponent },
      { path: 'con-list', component: TagConListComponent },
      { path: 'con-form-create', component: TagConFormComponent },
      { path: 'con-form-create/:code', component: TagConFormComponent },
      { path: 'con-form-edit/:code', component: TagConFormEditComponent },
      { path: 'con-form-detail/:code', component: TagConFormDetailComponent },
      { path: 'sed-list', component: TagSedListComponent },
      { path: 'sed-form-create', component: TagSedFormComponent },
      { path: 'sed-form-detail/:code', component: TagSedFormDetailComponent },
      { path: 'al-list', component: TagAlListComponent },
      { path: 'al-form-create', component: TagAlFormComponent },
      { path: 'al-form-detail/:code', component: TagAlFormDetailComponent },
      { path: 'cl-list', component: TagClListComponent },
      { path: 'cl-form-create', component: TagClFormComponent },
      { path: 'cl-form-detail/:code', component: TagClFormDetailComponent }
    ]
  },

  // Handle all other routes
  { path: '**', redirectTo: 'starterview' }
];
