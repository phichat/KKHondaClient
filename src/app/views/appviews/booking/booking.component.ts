import { Component, OnInit } from '@angular/core';
import { ModelBookingDetail, ModelMotobike, ProductBrand } from '../../../models';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  // styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  modelBooking: ModelBookingDetail;
  modelMotobike: ModelMotobike;
  productBrand: ProductBrand

  constructor() {
    this.modelBooking = new ModelBookingDetail();
    this.modelMotobike = new ModelMotobike();

    this.modelBooking.bookingCode = 'New';
    this.modelBooking.mbAmnt = 0.00;
    this.modelBooking.itemAmnt = 0.00;
    this.modelBooking.totalSell = 0.00;
    this.modelBooking.totalDiscount = 0.00;
    this.modelBooking.totalVat = 0.00;
    this.modelBooking.totalSellNet = 0.00;
   }

  ngOnInit() {
  }

}
