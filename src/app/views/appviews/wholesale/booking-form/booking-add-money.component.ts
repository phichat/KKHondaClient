import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IPayment } from 'app/interfaces/payment.interface';
import { BookingEditComponent } from './booking-edit.component';
import { FormBuilder } from '@angular/forms';
import { ProductService } from 'app/services/products';
import { UserService } from 'app/services/users';
import { CustomerService } from 'app/services/customers';

@Component({
  selector: 'app-booking-add-money',
  templateUrl: 'booking-add-money.component.html'
})

export class BookingAddMoneyComponent extends BookingEditComponent implements OnInit {
  protected paymentData: IPayment = {
    paymentPrice: null,
    accBankId: null,
    paymentDate: new Date(),
    options: {
      invalid: true,
      disabled: false
    }
  };

  constructor(
    public chRef: ChangeDetectorRef,
    public fb: FormBuilder,
    public s_product: ProductService,
    public s_user: UserService,
    public s_customer: CustomerService
  ) {
    super(chRef, fb, s_product, s_user, s_customer);

    this.user = this.s_user.cookies;
    this.formPayment = this.paymentData;
    this.PaymentData.next(this.formPayment);
    this.formGroup.get('paymentType').enable();
    this.formGroup.get('customerCode').disable();
    this.formGroup.get('receiveDate').disable();
    this.formGroup.get('bookingDate').disable();
  }

  ngOnInit() {
    this.searchCustomer();

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