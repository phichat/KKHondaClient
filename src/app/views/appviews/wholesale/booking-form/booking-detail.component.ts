import { Component, OnInit } from '@angular/core';
import { BookingFormConfig } from './booking-form.config';
import { FormBuilder } from '@angular/forms';
import { leftPad } from 'app/app.config';
import { ReasonService } from 'app/services/masters';
import { Observable } from 'rxjs/Observable';
import { DropDownModel } from 'app/models/drop-down-model';

@Component({
  selector: 'app-booking-detail',
  templateUrl: 'booking-detail.component.html'
})

export class BookingDetailComponent extends BookingFormConfig implements OnInit {
  productMcItem: any[] = [];
  bookingList: any[] = [];
  bookingDate = new Date();
  receiveDate = (new Date()).setDate(10);
  bookingNo: string;
  reasonDropdown: Observable<DropDownModel[]>;

  bookingSlip = { modalId: 'cancelBooking', title: 'ใบจองสินค้า' };

  constructor(
    public fb: FormBuilder,
    private s_reason: ReasonService
  ) {
    super();
    this.reasonDropdown = this.s_reason.DropDown();
  }

  ngOnInit() {
    for (let index = 0; index < 3; index++) {
      this.bookingList.push({
        bookingNo: `PR${leftPad((index + 1).toString(), 8, '0')}`,
        paymentType: 'เงินสด',
        paymentDate: new Date(),
        totalPaymentPrice: 10000
      })

    }
    for (let index = 0; index < 5; index++) {
      this.productMcItem.push(
        {
          itemName: 'HONDA SCOOPY I 2018 TH ฟ้า-น้ำเงิน',
          sellNet: 48153.35,
          orders: 5,
          backlogs: 5,
          total: 48153.35 * 5
        }
      );
    }

  }
}