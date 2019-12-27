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
import { ReportRefundBookingService } from './report-refund-booking.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { ReportRefundBooking } from './report-refund-booking.interface';


@Component({
  selector: 'app-report-refund-booking',
  templateUrl: './report-refund-booking.component.html',
  styleUrls: ['./report-refund-booking.component.scss']
})
export class ReportRefundBookingComponent implements OnInit {

  ACBranch: AutoCompleteModel[];
  ACProductType: AutoCompleteModel[];
  ACVersion: AutoCompleteModel[];
  ACDesign: AutoCompleteModel[];
  ACColor: AutoCompleteModel[];
  ACBookingName: AutoCompleteModel[];
  ACRegisName: AutoCompleteModel[];

  myDatePickerOptions = MyDatePickerOptions;

  formModel = new ReportRefundBooking();

  constructor(
    private s_ReportRefundBooking: ReportRefundBookingService
  ) {
  }

  
  ngOnInit() {
    this.formModel.branchType = '1';
    this.formModel.brandType = '1';
    this.formModel.bookingName = '1';
    // this.formModel.bookingStatus = '1';
    this.formModel.bookingDate = '1';
    this.formModel.RefundbookingReceiveDate = '1';

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
    let strParameter = "?RefundBookingReport=true"; // page

    const fm = <ReportRefundBooking>form.value;

    //สาขา
    strParameter += "&branchType=" + fm.branchType;
    if (fm.branchType == '1') {
      strParameter += "&branchId=0"
    } else {
      strParameter += "&branchId=" + mapAutoCompleteIdToString(fm.branchId);
    }

    //ยี่ห้อ รุ่น แบบ สี
    // fm.brandTypeId.reduce()

    const brandTypeId = (fm.brandType == '1' ? 0 : mapAutoCompleteIdToString(fm.brandTypeId));
    const version = (fm.brandType == '1' || !fm.version ? 0 : mapAutoCompleteIdToString(fm.version));
    const design = (fm.brandType == '1' || !fm.design ? 0 : mapAutoCompleteIdToString(fm.design));
    const color = (fm.brandType == '1' || !fm.color ? 0 : mapAutoCompleteIdToString(fm.color));
    strParameter += "&brandType=" + fm.brandType;
    strParameter += "&brandTypeId=" + (brandTypeId || 0);
    strParameter += "&version=" + (version || 0);
    strParameter += "&design=" + (design || 0);
    strParameter += "&color=" + (color || 0);

    //ชื่อผู้จอง/ชื่อจดทะเบียน
    const bookingNameId = (fm.bookingName != '2' ? "" : fm.bookingNameId);
    const regisNameId = (fm.bookingName != '3' ? "" : fm.regisNameId);
    strParameter += "&bookingName=" + fm.bookingName;
    strParameter += "&bookingNameId=" + (bookingNameId || "");
    strParameter += "&regisNameId=" + (regisNameId || "");

    //สถานะใบจอง
    // const bookingStatusId = (fm.bookingStatus == '1' ? "" : fm.bookingStatusId);
    // strParameter += "&bookingStatus=" + fm.bookingStatus;
    // strParameter += "&bookingStatusId=" + (bookingStatusId || "");

    //วันที่จอง
    const sDate = (fm.bookingDate == '1' ? "" : fm.sDate);
    const eDate = (fm.bookingDate == '1' ? "" : fm.eDate);
    strParameter += "&bookingDate=" + fm.bookingDate;
    strParameter += "&sDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&eDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

    // //วันที่ถึงกำหนด
    const sRefundbookingReceiveDate = (fm.RefundbookingReceiveDate == '1' ? "" : fm.sRefundbookingReceiveDate);
    const eRefundbookingReceiveDate = (fm.RefundbookingReceiveDate == '1' ? "" : fm.eRefundbookingReceiveDate);
    strParameter += "&RefundbookingReceiveDate=" + fm.RefundbookingReceiveDate;
    strParameter += "&sRefundbookingReceiveDate=" + (sRefundbookingReceiveDate ? setZeroHours(getDateMyDatepicker(sRefundbookingReceiveDate)) : "");
    strParameter += "&eRefundbookingReceiveDate=" + (eRefundbookingReceiveDate ? setZeroHours(getDateMyDatepicker(eRefundbookingReceiveDate)) : "");

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }


}
