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
import { TaxSaleSpareService } from './tax-sale-spare.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { TaxSaleSpare } from './tax-sale-spare.interface';

@Component({
  selector: 'app-tax-sale-spare',
  templateUrl: './tax-sale-spare.component.html',
  styleUrls: ['./tax-sale-spare.component.scss']
})
export class TaxSaleSpareComponent implements OnInit {

  AC_Branch: AutoCompleteModel[];

  myDatePickerOptions = MyDatePickerOptions;
  formModel = new TaxSaleSpare();

  constructor(
    private s_CommissionSale: TaxSaleSpareService
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

    let strParameter = "?TaxSaleSpare=true"; // page

    const fm = <TaxSaleSpare>form.value;

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
