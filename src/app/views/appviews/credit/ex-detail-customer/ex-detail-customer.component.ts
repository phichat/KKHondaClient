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

<<<<<<< HEAD
  ngOnInit() {
    console.log(this._bookingService.currentData);
    this._bookingService.currentData.subscribe(o => {
      this.modelBooking = o;
    });
  }
=======
    ngOnInit() {
        this._bookingService.currentData.subscribe(o => {
            this.modelBooking = new BookingModel();
            this.modelBooking = o;
        });
    }
>>>>>>> c6fa09879bc1e177ddb4d20ae4937fed31d7db6d

}
