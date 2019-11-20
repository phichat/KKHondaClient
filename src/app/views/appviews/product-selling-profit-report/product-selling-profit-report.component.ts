import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProductSellingProfitReport } from './product-selling-profit-report';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-product-selling-profit-report',
  templateUrl: './product-selling-profit-report.component.html',
  styleUrls: ['./product-selling-profit-report.component.scss']
})
export class ProductSellingProfitReportComponent implements OnInit {

  url: string = `${appConfig.reportUrl}/MCS/indexMCS2.aspx` + "?ProductSellingProfit=true";
  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  onPrint(form: any) {
    // const fm = <ProductSellingProfitReport>form.value;
    let strParameter = "?ProductSellingProfit=true"; // page;

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }
}
