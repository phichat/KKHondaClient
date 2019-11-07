import { Component, OnInit } from '@angular/core';
import { SummaryStockBalance } from './summary-stock-balance';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-summary-stock-balance',
  templateUrl: './summary-stock-balance.component.html',
  styleUrls: ['./summary-stock-balance.component.scss']
})
export class SummaryStockBalanceComponent implements OnInit {

  myDatePickerOptions = MyDatePickerOptions

  constructor() { }

  formModel = new SummaryStockBalance();

  ngOnInit() {
    this.formModel.isTypeDate = '1';
  }

  onPrint(form: any) {
    const fm = <SummaryStockBalance>form.value;
    let strParameter = "?StockBalance=true"; // page;

    //วันที่
    const sDate = (fm.isTypeDate == '1' ? "" : fm.sDate);
    const eDate = (fm.isTypeDate == '1' ? "" : fm.eDate);
    strParameter += "&isDate=" + fm.isTypeDate;
    strParameter += "&strStartDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&strEndDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
