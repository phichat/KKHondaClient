import { Component, OnInit } from '@angular/core';
import { TahHistoryConfig } from './tag-history-car.config';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tag-history-car',
  templateUrl: './tag-history-car.component.html',
  styleUrls: ['./tag-history-car.component.scss']
})
export class TagHistoryCarComponent extends TahHistoryConfig implements OnInit {

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      tagNo: new FormControl(null),
      province: new FormControl(null),
      catName: new FormControl(null),
      brandName: new FormControl(null),
      modelName: new FormControl(null),
      colorName: new FormControl(null),
      fNo: new FormControl(null),
      eNo: new FormControl(null),
      tagRegis: new FormControl(null),
      tagExpire: new FormControl(null),
      prbNo: new FormControl(null),
      prbCompany: new FormControl(null),
      prbRegis: new FormControl(null),
      prbExpire: new FormControl(null),
      commitNo: new FormControl(null),
      commitExpire: new FormControl(null),
      warNo: new FormControl(null),
      warCompany: new FormControl(null),
      warRegis: new FormControl(null),
      warExpire: new FormControl(null),

      ownershipEntityType: new FormControl(this.EntityType.Layman),

      ownershipCustomerPrename: new FormControl(null),
      ownershipCustomerSex: new FormControl(null),
      ownershipName: new FormControl(null),
      ownershipSurname: new FormControl(null),
      ownershipCustomerNickname: new FormControl(null),
      ownershipIdcard: new FormControl(null),
      ownershipCustomerPhone: new FormControl(null),
      ownershipCustomerEmail: new FormControl(null),
      ownershipBirthday: new FormControl(null),
      ownershipFulladdress: new FormControl(null),

      contractEntityType: new FormControl(this.EntityType.Layman),

      contractCustomerPrename: new FormControl(null),
      contractCustomerSex: new FormControl(null),
      contractCustomerName: new FormControl(null),
      contractCustomerSurname: new FormControl(null),
      contractCustomerNickname: new FormControl(null),
      contractIdcard: new FormControl(null),
      contractCustomerPhone: new FormControl(null),
      contractCustomerEmail: new FormControl(null),
      contractBirthday: new FormControl(null),
      contractFulladdress: new FormControl(null),
    });

    this.formGroup.get('eNo')
      .valueChanges
      .subscribe(x => this.ENo.emit(x));

    this.formGroup.get('fNo')
      .valueChanges
      .subscribe(x => this.FNo.emit(x));
  }
}
