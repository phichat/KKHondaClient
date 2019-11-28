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
import { TaxSaleService } from './tax-sale.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { TaxSale } from './tax-sale.interface';

@Component({
  selector: 'app-tax-sale',
  templateUrl: './tax-sale.component.html',
  styleUrls: ['./tax-sale.component.scss']
})
export class TaxSaleComponent implements OnInit {

  AC_Branch: AutoCompleteModel[];

  myDatePickerOptions = MyDatePickerOptions;
  formModel = new TaxSale();

  constructor(
    private s_CommissionSale: TaxSaleService
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

    let strParameter = "?TaxSale=true"; // page

    const fm = <TaxSale>form.value;

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
