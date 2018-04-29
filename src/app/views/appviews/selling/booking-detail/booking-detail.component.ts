import { Component, OnInit } from '@angular/core';
import { ModelBookingDetail } from '../../../../models/selling';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements OnInit {

  modelBooking = new ModelBookingDetail();
  constructor() { }

  ngOnInit() {
  }

}
