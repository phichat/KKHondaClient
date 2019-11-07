import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit() {
  }

  onPrint(form: any) {
    // const fm = <CreditNoteDetailsReport>form.value;
    let strParameter = "?CreditNoteDetailsReport=true"; // page;

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }
}
