import { Component, OnInit } from '@angular/core';
import { SummarySaleReportByType } from './summary-sale-report-by-type';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-summary-sale-report-by-type',
  templateUrl: './summary-sale-report-by-type.component.html',
  styleUrls: ['./summary-sale-report-by-type.component.scss']
})
export class SummarySaleReportByTypeComponent implements OnInit {

  myDatePickerOptions = MyDatePickerOptions

  constructor() { }

  formModel = new SummarySaleReportByType();

  ngOnInit() {
    this.formModel.isDate = '1';
  }
  
  onPrint(form: any) {
    const fm = <SummarySaleReportByType>form.value;
    let strParameter = "?SaleReportByType=true"; // page;

    //วันที่
    const sDate = (fm.isDate == '1' ? "" : fm.sDate);
    const eDate = (fm.isDate == '1' ? "" : fm.eDate);
    strParameter += "&isDate=" + fm.isDate;
    strParameter += "&strStartDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&strEndDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
