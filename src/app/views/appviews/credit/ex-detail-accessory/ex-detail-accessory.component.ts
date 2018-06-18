import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookingItemModel } from '../../../../models/selling';
import { BookingService } from '../../../../services/selling';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
declare var $: any;
declare var toastr: any;
declare var footable: any;

@Component({
    selector: 'app-ex-detail-accessory',
    templateUrl: './ex-detail-accessory.component.html'
})
export class ExDetailAccessoryComponent implements OnInit {

    modelAccessory: Array<BookingItemModel>;
    constructor(
        private _bookingService: BookingService,
        private chRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._bookingService.currentData.subscribe(o => {
            this.modelAccessory = new Array<BookingItemModel>();
            if (o.bookingItem) {
                this.modelAccessory = o.bookingItem.filter(i => i.itemType === 2);
            }

        })
    }

}
