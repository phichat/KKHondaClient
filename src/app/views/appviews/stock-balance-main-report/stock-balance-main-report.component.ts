import { Component, OnInit } from '@angular/core';
import { StockBalanceMainReport } from './stock-balance-main-report';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-stock-balance-main-report',
  templateUrl: './stock-balance-main-report.component.html',
  styleUrls: ['./stock-balance-main-report.component.scss']
})
export class StockBalanceMainReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onPrint(form: any) {
    // const fm = <StockBalanceMainReport>form.value;
    let strParameter = "?StockBalanceMain=true"; // page;

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }
}
