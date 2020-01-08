import { Component, OnInit } from '@angular/core';
import { SaleFormConfig } from './sale-form.config';
import { UserService } from 'app/services/users';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sale-create',
  templateUrl: 'sale-create.component.html',
  styleUrls: ['sale-form.scss']
})

export class SaleCreateComponent extends SaleFormConfig implements OnInit {
  constructor(
    private fb: FormBuilder,
    private s_user: UserService
  ) {
    super();
    this.user = this.s_user.cookies;
    this.formGroup.get('bookingNo').disable();
    this.formGroup.get('customerFullName').disable();
  }

  ngOnInit() {
    for (let index = 0; index < 5; index++) {
      this.ProductItem.push(
        this.fb.group({
          itemName: 'HONDA SCOOPY I 2018 TH ฟ้า-น้ำเงิน',
          sellNet: 48153.35,
          orders: 5,
          backlogs: 5,
          total: 48153.35 * 5
        })
      );
    }
  }
}