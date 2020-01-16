import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { MyDatePickerTHModule } from 'mydatepicker-th';

import { McsSavePoService} from './mcs-save-po/mcs-save-po.service';
import { McsSavePoListComponent } from './mcs-save-po/mcs-save-po-list.component';
import { McsSavePoCreateComponent } from './mcs-save-po/mcs-save-po-create.component';
import { McsSavePoDetailComponent } from './mcs-save-po/mcs-save-po-detail.component';
import { McsSavePoEditComponent } from './mcs-save-po/mcs-save-po-edit.component';

import { McsStockReceiveService} from './mcs-stock-receive/mcs-stock-receive.service';
import { McsStockReceiveListComponent } from './mcs-stock-receive/mcs-stock-receive-list.component';
import { McsStockReceiveCreateComponent } from './mcs-stock-receive/mcs-stock-receive-create.component';
import { McsStockReceiveDetailComponent } from './mcs-stock-receive/mcs-stock-receive-detail.component';

import { McsStockReceiveSingleCreateComponent } from './mcs-stock-receive/mcs-stock-receive-single-create.component';
import { McsStockReceiveSingleDetailComponent } from './mcs-stock-receive/mcs-stock-receive-single-detail.component';

import { McsSaveInvoiceService} from './mcs-save-invoice/mcs-save-invoice.service';
import { McsSaveInvoiceListComponent } from './mcs-save-invoice/mcs-save-invoice-list.component';
import { McsSaveInvoiceCreateComponent } from './mcs-save-invoice/mcs-save-invoice-create.component';
import { McsSaveInvoiceDetailComponent } from './mcs-save-invoice/mcs-save-invoice-detail.component';

import { McsSaveReceiptService} from './mcs-save-receipt/mcs-save-receipt.service';
import { McsSaveReceiptListComponent } from './mcs-save-receipt/mcs-save-receipt-list.component';
import { McsSaveReceiptCreateComponent } from './mcs-save-receipt/mcs-save-receipt-create.component';
import { McsSaveReceiptDetailComponent } from './mcs-save-receipt/mcs-save-receipt-detail.component';

import { McsReportReceiveComponent } from './mcs-report-receive/mcs-report-receive.component';
import { McsReportTaxPoComponent } from './mcs-report-tax-po/mcs-report-tax-po.component';
import { ThaiMatDatepickerModule } from 'app/components/common/thai-mat-datepicker/thai-mat-datepicker.module';


@NgModule({
  declarations: [
    McsSavePoListComponent,
    McsSavePoCreateComponent,
    McsSavePoDetailComponent,
    McsSavePoEditComponent,
    
    McsStockReceiveListComponent,
    McsStockReceiveCreateComponent,
    McsStockReceiveDetailComponent,
    McsStockReceiveSingleCreateComponent,
    McsStockReceiveSingleDetailComponent,

    McsSaveInvoiceListComponent,
    McsSaveInvoiceCreateComponent,
    McsSaveInvoiceDetailComponent,

    McsSaveReceiptListComponent,
    McsSaveReceiptCreateComponent,
    McsSaveReceiptDetailComponent,

    McsReportReceiveComponent,
    McsReportTaxPoComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MyDatePickerTHModule,
    ThaiMatDatepickerModule,
  ],
  providers: [
    McsSavePoService,
    McsStockReceiveService,
    McsSaveInvoiceService,
    McsSaveReceiptService,
  ]
})
export class MCSModule { }
