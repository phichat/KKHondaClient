import { Component, OnInit } from '@angular/core';
import { ModelBookingDetail } from '../../../models/model-booking-detail';
import ModelMotobike from '../../../models/model-motobike';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  // styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  modelBooking: ModelBookingDetail;
  modelMotobike: ModelMotobike;

  constructor() { }

  ngOnInit() {
  }

}
