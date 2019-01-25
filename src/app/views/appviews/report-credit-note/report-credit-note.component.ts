import { Component, OnInit } from '@angular/core';
import { ReportBookingService } from '../report-booking/report-booking.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';
import { ReportCreditNote } from './report-credit-note'

@Component({
  selector: 'app-report-credit-note',
  templateUrl: './report-credit-note.component.html',
  styleUrls: ['./report-credit-note.component.scss']
})
export class ReportCreditNoteComponent implements OnInit {

  myDatePickerOptions = MyDatePickerOptions;

  constructor(
    private s_ReportBooking: ReportBookingService
  ) { }

  formModel = new ReportCreditNote();
  ACBranch: AutoCompleteModel[];
  ACBookingName: AutoCompleteModel[];


  ngOnInit() {
    this.formModel.branchType = '1';
    this.formModel.bookingName = '1';
    this.formModel.bookingDate = '1';

    this.s_ReportBooking.GetBranchAutoComplete().subscribe(x => {
      this.ACBranch = mapDropDownnToAutoComplete(x);
    });
    this.s_ReportBooking.GetBookingNameAutoComplete().subscribe(x => {
      this.ACBookingName = x;
    });
  }

  onPrint(form: any) {

    let strParameter = "?CreditNote=true"; // page

    const fm = <ReportCreditNote>form.value;

    //สาขา
    strParameter += "&branchType=" + fm.branchType;
    if (fm.branchType == '1') {
      strParameter += "&branchId=0"
    } else {
      strParameter += "&branchId=" + mapAutoCompleteIdToString(fm.branchId);
    }

    //ชื่อผู้จอง/ชื่อจดทะเบียน
    const bookingNameId = (fm.bookingName != '2' ? "" : fm.bookingNameId);
    const regisNameId = (fm.bookingName != '3' ? "" : fm.regisNameId);
    strParameter += "&bookingName=" + fm.bookingName;
    strParameter += "&bookingNameId=" + (bookingNameId || "");
    strParameter += "&regisNameId=" + (regisNameId || "");

    //วันที่จอง
    const sDate = (fm.bookingDate == '1' ? "" : fm.sDate);
    const eDate = (fm.bookingDate == '1' ? "" : fm.eDate);
    strParameter += "&bookingDate=" + fm.bookingDate;
    strParameter += "&sDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&eDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }
}
