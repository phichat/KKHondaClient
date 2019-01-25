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
import { ReportBookingService } from './report-booking.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { ReportBooking } from './report-booking.interface';

@Component({
  selector: 'app-report-booking',
  templateUrl: './report-booking.component.html',
  styleUrls: ['./report-booking.component.scss']
})
export class ReportBookingComponent implements OnInit {

  ACBranch: AutoCompleteModel[];
  ACProductType: AutoCompleteModel[];
  ACVersion: AutoCompleteModel[];
  ACDesign: AutoCompleteModel[];
  ACColor: AutoCompleteModel[];
  ACBookingName: AutoCompleteModel[];
  ACRegisName: AutoCompleteModel[];

  myDatePickerOptions = MyDatePickerOptions;

  formModel = new ReportBooking();

  constructor(
    private s_ReportBooking: ReportBookingService
  ) {
  }

  ngOnInit() {
    this.formModel.branchType = '1';
    this.formModel.brandType = '1';
    this.formModel.bookingName = '1';
    this.formModel.bookingStatus = '1';
    this.formModel.bookingDate = '1';
    this.formModel.bookingReceiveDate = '1';

    this.s_ReportBooking.GetBookingNameAutoComplete().subscribe(x => {
      this.ACBookingName = x;
    });
    this.s_ReportBooking.GetRegisNameAutoComplete().subscribe(x => {
      this.ACRegisName = x;
    });
    this.s_ReportBooking.GetBranchAutoComplete().subscribe(x => {
      this.ACBranch = mapDropDownnToAutoComplete(x);
    });
    this.s_ReportBooking.GetColorAutoComplete().subscribe(x => {
      this.ACColor = mapDropDownnToAutoComplete(x);
    });
    this.s_ReportBooking.GetDesignAutoComplete().subscribe(x => {
      this.ACDesign = mapDropDownnToAutoComplete(x);
    });
    this.s_ReportBooking.GetProductTypeAutoComplete().subscribe(x => {
      this.ACProductType = mapDropDownnToAutoComplete(x);
    });
    this.s_ReportBooking.GetVersionAutoComplete().subscribe(x => {
      this.ACVersion = mapDropDownnToAutoComplete(x);
    });
  }



  onPrint(form: any) {
    let strParameter = "?BookingReport=true"; // page

    const fm = <ReportBooking>form.value;

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
    const version = (fm.brandType == '1' ? 0 : mapAutoCompleteIdToString(fm.version));
    const design = (fm.brandType == '1' ? 0 : mapAutoCompleteIdToString(fm.design));
    const color = (fm.brandType == '1' ? 0 : mapAutoCompleteIdToString(fm.color));
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
    const bookingStatusId = (fm.bookingStatus == '1' ? "" : fm.bookingStatusId);
    strParameter += "&bookingStatus=" + fm.bookingStatus;
    strParameter += "&bookingStatusId=" + (bookingStatusId || "");

    //วันที่จอง
    const sDate = (fm.bookingDate == '1' ? "" : fm.sDate);
    const eDate = (fm.bookingDate == '1' ? "" : fm.eDate);
    strParameter += "&bookingDate=" + fm.bookingDate;
    strParameter += "&sDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&eDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

    // //วันที่ถึงกำหนด
    const sBookingReceiveDate = (fm.bookingReceiveDate == '1' ? "" : fm.sBookingReceiveDate);
    const eBookingReceiveDate = (fm.bookingReceiveDate == '1' ? "" : fm.eBookingReceiveDate);
    strParameter += "&bookingReceiveDate=" + fm.bookingReceiveDate;
    strParameter += "&sBookingReceiveDate=" + (sBookingReceiveDate ? setZeroHours(getDateMyDatepicker(sBookingReceiveDate)) : "");
    strParameter += "&eBookingReceiveDate=" + (eBookingReceiveDate ? setZeroHours(getDateMyDatepicker(eBookingReceiveDate)) : "");

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
