import { Component, OnInit } from '@angular/core';
import { BookingModel } from '../../../../models/selling';
import { BookingService } from '../../../../services/selling';
import { setLocalDate } from '../../../../app.config';

@Component({
    selector: 'app-ex-detail-customer',
    templateUrl: './ex-detail-customer.component.html'
})
export class ExDetailCustomerComponent implements OnInit {

    modelBooking: BookingModel;
    constructor(private _bookingService: BookingService) { }

    ngOnInit() {
        this._bookingService.currentData.subscribe(o => {
            this.modelBooking = new BookingModel();
            o.bookingDate = setLocalDate(o.bookingDate);
            o.receiveDate = setLocalDate(o.receiveDate);
            this.modelBooking = o;
        });
    }

}
