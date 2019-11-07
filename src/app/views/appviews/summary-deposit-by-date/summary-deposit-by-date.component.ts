import { Component, OnInit } from '@angular/core';
import { SummaryDepositByDate } from './summary-deposit-by-date';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-summary-deposit-by-date',
  templateUrl: './summary-deposit-by-date.component.html',
  styleUrls: ['./summary-deposit-by-date.component.scss']
})
export class SummaryDepositByDateComponent implements OnInit {


  myDatePickerOptions = MyDatePickerOptions

  constructor() { }

  formModel = new SummaryDepositByDate();

  ngOnInit() {
    this.formModel.isTypeDate = '1';
  }

  onPrint(form: any) {
    const fm = <SummaryDepositByDate>form.value;
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
