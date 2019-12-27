import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SummaryDepositReport } from './summary-deposit-report';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-summary-deposit-report',
  templateUrl: './summary-deposit-report.component.html',
  styleUrls: ['./summary-deposit-report.component.scss']
})
export class SummaryDepositReportComponent implements OnInit {

  url: string = `${appConfig.reportUrl}/MCS/indexMCS2.aspx` + "?SummaryDepositReport=true";
  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }


  onPrint(form: any) {
    // const fm = <SummaryDepositReport>form.value;
    let strParameter = "?SummaryDepositReport=true"; // page;

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
