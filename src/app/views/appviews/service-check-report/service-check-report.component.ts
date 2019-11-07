import { Component, OnInit } from '@angular/core';
import { ServiceCheckReport } from './service-check-report';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-service-check-report',
  templateUrl: './service-check-report.component.html',
  styleUrls: ['./service-check-report.component.scss']
})
export class ServiceCheckReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onPrint(form: any) {
    // const fm = <ServiceCheckReport>form.value;
    let strParameter = "?ServiceCheckReport=true"; // page;

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
