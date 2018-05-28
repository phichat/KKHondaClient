import { Component, OnInit } from '@angular/core';
import { BookingModel, BookingItemModel } from '../../../../models/selling';
import { BookingService } from '../../../../services/selling';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'app-ex-detail-motobike',
    templateUrl: './ex-detail-motobike.component.html'
})

export class ExDetailMotobikeComponent implements OnInit {

    modelBooking: BookingModel;
    modelMotobike: BookingItemModel;

    constructor(private _bookingService: BookingService) { }

    ngOnInit() {
        this._bookingService.currentData.subscribe(o => {
            this.modelBooking = new BookingModel();
            this.modelMotobike = new BookingItemModel();
            if (o.bookingItem) {

                this.modelBooking = o;

                o.bookingItem
                    .filter(i => i.itemType === 1)
                    .map(i => this.modelMotobike = i);

            }
        });
    }
}
