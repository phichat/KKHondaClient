import { Component, OnInit } from '@angular/core';
import { BookingModel } from '../../../../models/selling';
import { BookingService } from '../../../../services/selling';

@Component({
    selector: 'app-ex-detail-free',
    templateUrl: './ex-detail-free.component.html'
})
export class ExDetailFreeComponent implements OnInit {

    modelBooking: BookingModel;
    constructor(private _bookingService: BookingService) { }

    ngOnInit() {
        this._bookingService.currentData.subscribe(o => {
            this.modelBooking = new BookingModel();
            this.modelBooking = o;
        });
    }

}
