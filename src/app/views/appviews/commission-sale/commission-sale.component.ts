import { Component, OnInit } from '@angular/core';
import {
  MyDatePickerOptions,
  getDateMyDatepicker,
  setZeroHours,
  appConfig,
  mapDropDownnToAutoComplete,
  mapAutoCompleteIdToString
}
  from 'app/app.config';
import { CommissionSaleService } from './commission-sale.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { CommissionSale } from './commission-sale.interface';

@Component({
  selector: 'app-commission-sale',
  templateUrl: './commission-sale.component.html',
  styleUrls: ['./commission-sale.component.scss']
})
export class CommissionSaleComponent implements OnInit {

  AC_Branch: AutoCompleteModel[];
  AC_Sell: AutoCompleteModel[];
  AC_Finance: AutoCompleteModel[];

  myDatePickerOptions = MyDatePickerOptions;

  formModel = new CommissionSale();

  constructor(
    private s_CommissionSale: CommissionSaleService
  ) {
  }

  ngOnInit() {
    this.formModel.branchType = '1';
    this.formModel.sellType = '1';
    this.formModel.financeType = '1';
    this.formModel.sellDate = '1';

    this.s_CommissionSale.GetBranchAutoComplete().subscribe(x => {
      this.AC_Branch = mapDropDownnToAutoComplete(x);
    });
    this.s_CommissionSale.GetSellNameAutoComplete().subscribe(x => {
      this.AC_Sell = mapDropDownnToAutoComplete(x);
    });
    this.s_CommissionSale.GetFinanceNameAutoComplete().subscribe(x => {
      this.AC_Finance = mapDropDownnToAutoComplete(x);
    });
  }

  onPrint(form: any) {

    let strParameter = "?CommissionSale=true"; // page

    const fm = <CommissionSale>form.value;

    //สาขา
    strParameter += "&branchType=" + fm.branchType;
    if (fm.branchType == '1') {
      strParameter += "&branchId=0"
    } else {
      strParameter += "&branchId=" + mapAutoCompleteIdToString(fm.branchId);
    }

    //วันที่ขาย
    const sDate = (fm.sellDate == '1' ? "" : fm.sDate);
    const eDate = (fm.sellDate == '1' ? "" : fm.eDate);
    strParameter += "&sellDate=" + (fm.sellDate == '1' ? "" : fm.sellDate);
    strParameter += "&sDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&eDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

    //ผู้ขาย
    strParameter += "&sellType=" + fm.sellType;
    if (fm.sellType == '1') {
      strParameter += "&sellId=0"
    } else {
      strParameter += "&sellId=" + mapAutoCompleteIdToString(fm.sellId);
    }

    //ไฟแนนซ์
    strParameter += "&financeType=" + fm.financeType;
    if (fm.financeType == '1') {
      strParameter += "&financeId=0"
    } else {
      strParameter += "&financeId=" + mapAutoCompleteIdToString(fm.financeId);
    }

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
