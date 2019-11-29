import { Component, OnInit } from '@angular/core';
import { IMyOptions, IMyDateModel } from "mydatepicker-th";
import {
  MyDatePickerOptions,
  getDateMyDatepicker,
  setZeroHours,
  setZero,
  appConfig,
  mapDropDownnToAutoComplete,
  mapAutoCompleteIdToString
}
  from 'app/app.config';
import { TaxPurchaseService } from './tax-purchase.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { TaxPurchase } from './tax-purchase.interface';
@Component({
  selector: 'app-tax-purchase',
  templateUrl: './tax-purchase.component.html',
  styleUrls: ['./tax-purchase.component.scss']
})
export class TaxPurchaseComponent implements OnInit {

  AC_Branch: AutoCompleteModel[];

  myDatePickerOptions = MyDatePickerOptions;

  // myDatePickerOptions: IMyOptions = {
  //   dateFormat: 'mm / yyyy',
  //   showClearDateBtn: true,
  //   height: '32px',
  //   openSelectorOnInputClick: true,
  //   editableDateField: false
  // };

  formModel = new TaxPurchase();

  constructor(
    private s_CommissionSale: TaxPurchaseService
  ) {
  }

  ngOnInit() {
    this.formModel.branchType = '1';
    this.formModel.reportType = '1';
    this.formModel.dateType = '1';

    let dateTime = new Date()

    this.formModel.dateMonth = `${setZero(dateTime.getMonth() + 1)}`;
    this.formModel.dateYear = `${setZero(dateTime.getFullYear())}`;

    this.s_CommissionSale.GetBranchAutoComplete().subscribe(x => {
      this.AC_Branch = mapDropDownnToAutoComplete(x);
    });

  }

  onPrint(form: any) {

    let strParameter = "?TaxPurchase=true"; // page

    const fm = <TaxPurchase>form.value;

    //สาขา
    strParameter += "&branchType=" + fm.branchType;
    if (fm.branchType == '1') {
      strParameter += "&branchId=0"
    } else {
      strParameter += "&branchId=" + mapAutoCompleteIdToString(fm.branchId);
    }

    //เงื่อนไข
    strParameter += "&reportType=" + (fm.reportType == '' ? "" : fm.reportType);

    //วันที่
    const sDate = (fm.dateType == '1' ? "" : fm.sDate);
    const eDate = (fm.dateType == '1' ? "" : fm.eDate);
    const dateMonthYear = (fm.dateType == '2' ? "" : `${fm.dateYear}-${fm.dateMonth}`);

    strParameter += "&dateMonthYear=" + dateMonthYear;

    strParameter += "&sDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&eDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
