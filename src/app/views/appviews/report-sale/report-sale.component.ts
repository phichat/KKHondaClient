import { Component, OnInit } from '@angular/core';
import { ReportBookingService } from '../report-booking/report-booking.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { ReportSale } from './report-sale';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-report-sale',
  templateUrl: './report-sale.component.html',
  styleUrls: ['./report-sale.component.scss']
})
export class ReportSaleComponent implements OnInit {

  myDatePickerOptions = MyDatePickerOptions

  constructor(private s_ReportBooking: ReportBookingService) { }

  ACBranch: AutoCompleteModel[];
  ACProductType: AutoCompleteModel[];
  ACVersion: AutoCompleteModel[];
  ACDesign: AutoCompleteModel[];
  ACColor: AutoCompleteModel[];
  ACSell: AutoCompleteModel[]

  formModel = new ReportSale();

  ngOnInit() {
    this.formModel.branchType = '1';
    this.formModel.brandType = '1';
    this.formModel.isSellName = '1';
    this.formModel.isPaymentType = '1';
    this.formModel.isSellDate = '1';

    this.s_ReportBooking.GetSellNameAutoComplete().subscribe(x => {
      this.ACSell = mapDropDownnToAutoComplete(x);
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
    const fm = <ReportSale>form.value;
    let strParameter = "?SaleReport=true"; // page;

    //สาขา
    strParameter += "&branchType=" + fm.branchType;
    if (fm.branchType == '1') {
      strParameter += "&branchId=0"
    } else {
      strParameter += "&branchId=" + mapAutoCompleteIdToString(fm.branchId);
    }

    //ยี่ห้อ รุ่น แบบ สี
    const brandTypeId = (fm.brandType == '1' ? 0 : mapAutoCompleteIdToString(fm.brandTypeId));
    const version = (fm.brandType == '1' ? 0 : mapAutoCompleteIdToString(fm.version));
    const design = (fm.brandType == '1' ? 0 : mapAutoCompleteIdToString(fm.design));
    const color = (fm.brandType == '1' ? 0 : mapAutoCompleteIdToString(fm.color));
    strParameter += "&brandType=" + fm.brandType;
    strParameter += "&brandTypeId=" + (brandTypeId || 0);
    strParameter += "&version=" + (version || 0);
    strParameter += "&design=" + (design || 0);
    strParameter += "&color=" + (color || 0);

    //ชื่อขาย 
    const sellId = (fm.isSellName == '1' ? "" : fm.SellId);
    strParameter += "&isSellName=" + fm.isSellName;
    strParameter += "&SellId=" + (sellId || "");

    //สถานะใบจอง
    const paymentTypeId = (fm.isPaymentType == '1' ? 0 : fm.paymentTypeId);
    strParameter += "&isPaymentType=" + fm.isPaymentType;
    strParameter += "&paymentTypeId=" + paymentTypeId;

    //วันที่ขาย
    const sDate = (fm.isSellDate == '1' ? "" : fm.sDate);
    const eDate = (fm.isSellDate == '1' ? "" : fm.eDate);
    strParameter += "&isSellDate=" + fm.isSellDate;
    strParameter += "&sDate=" + (sDate ? setZeroHours(getDateMyDatepicker(sDate)) : '');
    strParameter += "&eDate=" + (eDate ? setZeroHours(getDateMyDatepicker(eDate)) : '');

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }
}
