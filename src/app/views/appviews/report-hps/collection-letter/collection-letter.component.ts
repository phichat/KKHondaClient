import { Component, OnInit } from '@angular/core';
import { CollectionLetter } from './collection-letter';
import {
  mapDropDownnToAutoComplete,
  MyDatePickerOptions,
  mapAutoCompleteIdToString,
  setZeroHours,
  getDateMyDatepicker,
  appConfig
} from 'app/app.config';
import { ContractCustomerService } from 'app/services/credit/contract-customer.service';
import { DropDownModel } from 'app/models/drop-down-model';

@Component({
  selector: 'app-collection-letter',
  templateUrl: './collection-letter.component.html',
  styleUrls: ['./collection-letter.component.scss']
})
export class CollectionLetterComponent implements OnInit {

  myDatePickerOptions = MyDatePickerOptions

  constructor(
    private s_contract: ContractCustomerService,
  ) { }

  formModel = new CollectionLetter();
  bookNoDropdown: DropDownModel[];

  ngOnInit() {
    this.s_contract.BookNoDropdown().subscribe(x => {
      this.bookNoDropdown = x
    })
  }

  onPrint(form: any) {
    const fm = <CollectionLetter>form.value;
    let strParameter = "?CollectionLetter=true"; // page;
    strParameter += "&cusType=" + 1;
    strParameter += "&bookNo=" + fm.bookNo;
    window.open(`${appConfig.reportUrl}/HPS/CollectionLetter.aspx` + strParameter, '_blank');

    this.s_contract.CheckGuarantor(fm.bookNo).subscribe(x => {
      if(x.contractGurantor1){
        strParameter = "?CollectionLetter=true"; // page;
        strParameter += "&cusType=" + 2;
        strParameter += "&bookNo=" + fm.bookNo;
        window.open(`${appConfig.reportUrl}/HPS/CollectionLetter.aspx` + strParameter, '_blank');
      }
    })

  }

}
