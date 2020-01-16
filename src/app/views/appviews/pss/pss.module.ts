import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { PssSavePoService} from './pss-save-po/pss-save-po.service';
import { PssSavePoListComponent } from './pss-save-po/pss-save-po-list.component';
import { PssSavePoCreateComponent } from './pss-save-po/pss-save-po-create.component';
import { PssSavePoDetailComponent } from './pss-save-po/pss-save-po-detail.component';
import { PssSavePoEditComponent } from './pss-save-po/pss-save-po-edit.component';

import { PssReturnProductService} from './pss-return-product/pss-return-product.service';
import { PssReturnProductListComponent } from './pss-return-product/pss-return-product-list.component';
import { PssReturnProductCreateComponent } from './pss-return-product/pss-return-product-create.component';
import { PssReturnProductDetailComponent } from './pss-return-product/pss-return-product-detail.component';
import { PssReturnProductEditComponent } from './pss-return-product/pss-return-product-edit.component';

import { PssStockReceiveService} from './pss-stock-receive/pss-stock-receive.service';
import { PssStockReceiveListComponent } from './pss-stock-receive/pss-stock-receive-list.component';
import { PssStockReceiveCreateComponent } from './pss-stock-receive/pss-stock-receive-create.component';
import { PssStockReceiveDetailComponent } from './pss-stock-receive/pss-stock-receive-detail.component';

import { MyDatePickerTHModule } from 'mydatepicker-th';
import { ThaiMatDatepickerModule } from 'app/components/common/thai-mat-datepicker/thai-mat-datepicker.module';
@NgModule({

  declarations: [
    PssSavePoListComponent,
    PssSavePoCreateComponent,
    PssSavePoDetailComponent,
    PssSavePoEditComponent,
    PssStockReceiveListComponent,
    PssStockReceiveCreateComponent,
    PssStockReceiveDetailComponent,
    PssReturnProductListComponent,
    PssReturnProductCreateComponent,
    PssReturnProductDetailComponent,
    PssReturnProductEditComponent,
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
    PssSavePoService,
    PssStockReceiveService,
    PssReturnProductService,
  ]
})
export class PSSModule { }
