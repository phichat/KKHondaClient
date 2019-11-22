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
import { ReportTopProductService } from './report-top-product.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { ReportTopProduct } from './report-top-product.interface';

@Component({
  selector: 'app-report-top-product',
  templateUrl: './report-top-product.component.html',
  styleUrls: ['./report-top-product.component.scss']
})
export class ReportTopProductComponent implements OnInit {

  ACBranch: AutoCompleteModel[];
  ACProductType: AutoCompleteModel[];
  ACVersion: AutoCompleteModel[];
  ACDesign: AutoCompleteModel[];
  ACColor: AutoCompleteModel[];
  ACBookingName: AutoCompleteModel[];
  ACRegisName: AutoCompleteModel[];

  myDatePickerOptions = MyDatePickerOptions;

  formModel = new ReportTopProduct();

  constructor(
    private s_ReportRefundBooking: ReportTopProductService
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
    let strParameter = "?ReportTopProduct=true"; // page

    const fm = <ReportTopProduct>form.value;

    //สาขา
    strParameter += "&branchType=" + fm.branchType;
    if (fm.branchType == '1') {
      strParameter += "&branchId=0"
    } else {
      strParameter += "&branchId=" + mapAutoCompleteIdToString(fm.branchId);
    }

    // สถานะใบจอง
    const selltypeId = (fm.selltype == '1' ? "" : fm.selltypeId);
    strParameter += "&selltype=" + (fm.selltype == '1' ? "" : fm.selltype);
    strParameter += "&selltypeId=" + (selltypeId || "");

    //วันที่ขาย
    const sDate = (fm.bookingDate == '1' ? "" : fm.sDate);
    const eDate = (fm.bookingDate == '1' ? "" : fm.eDate);
    strParameter += "&bookingDate=" + (fm.bookingDate == '1' ? "" : fm.bookingDate);
    strParameter += "&sDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&eDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

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

    //Top Rank
    const topRank = (fm.topRank == '' ? '0' : fm.topRank);
    strParameter += "&topRank=" + fm.topRank;


    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
