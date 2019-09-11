import { Component, OnInit } from '@angular/core';
import { ReportBookingService } from '../report-booking/report-booking.service';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { ReportBalanceStock } from './report-balance-stock';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-report-balance-stock2',
  templateUrl: './report-balance-stock2.component.html',
  styleUrls: ['./report-balance-stock.component.scss']
})
export class ReportBalanceStock2Component implements OnInit {

  myDatePickerOptions = MyDatePickerOptions

  constructor(private s_ReportBooking: ReportBookingService) { }

  ACBranch: AutoCompleteModel[];
  ACProductType: AutoCompleteModel[];
  ACVersion: AutoCompleteModel[];
  ACDesign: AutoCompleteModel[];
  ACColor: AutoCompleteModel[];
  ACSell: AutoCompleteModel[]

  formModel = new ReportBalanceStock();

  ngOnInit() {
    this.formModel.branchType = '1';
    this.formModel.brandType = '1';

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
    const fm = <ReportBalanceStock>form.value;
    let strParameter = "?BalanceStockReport=true"; // page;

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
    strParameter += "&itemType=2";

    //window.open(`http://localhost:58874/MCS/indexMCS2.aspx` + strParameter, '_blank');
    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }
}
