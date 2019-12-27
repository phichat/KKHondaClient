import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CreditNoteDetailsReport } from './credit-note-details-report';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-credit-note-details-report',
  templateUrl: './credit-note-details-report.component.html',
  styleUrls: ['./credit-note-details-report.component.scss']
})
export class CreditNoteDetailsReportComponent implements OnInit {

  url: string = `${appConfig.reportUrl}/MCS/indexMCS2.aspx` + "?CreditNoteDetailsReport=true";
  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  onPrint(form: any) {
    // const fm = <CreditNoteDetailsReport>form.value;
    let strParameter = "?CreditNoteDetailsReport=true"; // page;

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }
}
