import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookingCreateComponent } from './booking-create.component';
import { ProductService } from 'app/services/products';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'app/services/users';
import { IPayment } from 'app/interfaces/payment.interface';
import { CustomerService } from 'app/services/customers';

@Component({
  selector: 'app-booking-edit',
  templateUrl: 'booking-edit.component.html',
  styleUrls: ['booking-form.component.scss']
})

export class BookingEditComponent extends BookingCreateComponent implements OnInit {

  protected paymentData: IPayment = {
    paymentPrice: 0,
    options: {
      invalid: false,
      disabled: true
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
    this.formGroup.get('paymentType').disable();
    this.formGroup.get('bookingNo').disable();
  }

  ngOnInit() {
    this.searchProductMc();
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

  onSave() {

  }
}