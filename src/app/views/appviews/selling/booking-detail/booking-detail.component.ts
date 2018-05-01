import { Component, OnInit } from '@angular/core';
import { ModelBookingDetail, ModelCustomer } from '../../../../models/selling';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements OnInit {

  path: string;
  modelCustomer = new ModelCustomer();
  modelBooking = new ModelBookingDetail();
  payStatus = [
    { value: 'Y', text: 'ชำระเรียบร้อย' },
    { value: 'N', text: 'ยังไม่ชำระ' }
  ]
  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  receiveCustomer($event) {
    this.modelCustomer = $event;
  }

}
