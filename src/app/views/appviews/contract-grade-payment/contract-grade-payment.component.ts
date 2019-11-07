import { Component, OnInit } from '@angular/core';
import { ContractGradePayment } from './contract-grade-payment';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';

@Component({
  selector: 'app-contract-grade-payment',
  templateUrl: './contract-grade-payment.component.html',
  styleUrls: ['./contract-grade-payment.component.scss']
})
export class ContractGradePaymentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onPrint(form: any) {
    //const fm = <ContractGradePayment>form.value;
    let strParameter = "?ExportContractGradePayment=true"; // page;

    window.open(`${appConfig.reportUrl}/MCS/indexMCS2.aspx` + strParameter, '_blank');
  }

}
