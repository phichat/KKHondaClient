import { Component, OnInit } from '@angular/core';
import { BookingModel } from '../../../../models/selling';
import { BookingService } from '../../../../services/selling';

@Component({
  selector: 'app-ex-detail-customer',
  templateUrl: './ex-detail-customer.component.html'
})
export class ExDetailCustomerComponent implements OnInit {

  modelBooking: BookingModel;
  constructor(private _bookingService: BookingService) { }

  ngOnInit() {
    console.log(this._bookingService.currentData);
    this._bookingService.currentData.subscribe(o => {
      this.modelBooking = o;
    });
  }

}
