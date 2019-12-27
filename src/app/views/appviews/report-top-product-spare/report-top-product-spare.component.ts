import { Component, OnInit } from '@angular/core';
import {
  MyDatePickerOptions,
  getDateMyDatepicker,
  setZeroHours,
  appConfig,
  mapDropDownnToAutoComplete,
  mapAutoCompleteIdToString
}
  from 'app/app.config';
import { ReportTopProductSpareService } from './report-top-product-spare.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { ReportTopProductSpare } from './report-top-product-spare.interface';

@Component({
  selector: 'app-report-top-product-spare',
  templateUrl: './report-top-product-spare.component.html',
  styleUrls: ['./report-top-product-spare.component.scss']
})
export class ReportTopProductSpareComponent implements OnInit {

  ACBranch: AutoCompleteModel[];
  ACProductType: AutoCompleteModel[];
  ACVersion: AutoCompleteModel[];
  ACDesign: AutoCompleteModel[];
  ACColor: AutoCompleteModel[];
  ACBookingName: AutoCompleteModel[];
  ACRegisName: AutoCompleteModel[];

  myDatePickerOptions = MyDatePickerOptions;

  formModel = new ReportTopProductSpare();

  constructor(
    private s_ReportRefundBooking: ReportTopProductSpareService
  ) {
  }


  ngOnInit() {
    this.formModel.branchType = '1';
    this.formModel.selltype = '1';
    this.formModel.bookingDate = '1';
    this.formModel.brandType = '1';
    this.formModel.topRank = '20';

    this.s_ReportRefundBooking.GetBookingNameAutoComplete().subscribe(x => {
      this.ACBookingName = x;
    });
    this.s_ReportRefundBooking.GetRegisNameAutoComplete().subscribe(x => {
      this.ACRegisName = x;
    });
    this.s_ReportRefundBooking.GetBranchAutoComplete().subscribe(x => {
      this.ACBranch = mapDropDownnToAutoComplete(x);
    });
    this.s_ReportRefundBooking.GetColorAutoComplete().subscribe(x => {
      this.ACColor = mapDropDownnToAutoComplete(x);
    });
    this.s_ReportRefundBooking.GetDesignAutoComplete().subscribe(x => {
      this.ACDesign = mapDropDownnToAutoComplete(x);
    });
    this.s_ReportRefundBooking.GetProductTypeAutoComplete().subscribe(x => {
      this.ACProductType = mapDropDownnToAutoComplete(x);
    });
    this.s_ReportRefundBooking.GetVersionAutoComplete().subscribe(x => {
      this.ACVersion = mapDropDownnToAutoComplete(x);
    });
  }


  onPrint(form: any) {
    let strParameter = "?ReportTopProductSpare=true"; // page

    const fm = <ReportTopProductSpare>form.value;

    //สาขา
    strParameter += "&branchType=" + fm.branchType;
    if (fm.branchType == '1') {
      strParameter += "&branchId=0"
    } else {
      strParameter += "&branchId=" + mapAutoCompleteIdToString(fm.branchId);
    }

    //วันที่ขาย
    const sDate = (fm.bookingDate == '1' ? "" : fm.sDate);
    const eDate = (fm.bookingDate == '1' ? "" : fm.eDate);
    strParameter += "&bookingDate=" + (fm.bookingDate == '1' ? "" : fm.bookingDate);
    strParameter += "&sDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&eDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

    //Top Rank
    const topRank = (fm.topRank == '' ? '0' : fm.topRank);
    strParameter += "&topRank=" + fm.topRank;


    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
