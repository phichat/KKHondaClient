import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  url: string = `${appConfig.reportUrl}/MCS/indexMCS2.aspx` + "?ServiceCheckReport=true";
  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }


  onPrint(form: any) {
    // const fm = <ServiceCheckReport>form.value;
    let strParameter = "?ServiceCheckReport=true"; // page;

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
