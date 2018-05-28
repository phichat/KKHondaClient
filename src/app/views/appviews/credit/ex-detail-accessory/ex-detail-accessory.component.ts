import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookingItemModel } from '../../../../models/selling';
import { BookingService } from '../../../../services/selling';
import { filter } from 'rxjs/operators';

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

                this.chRef.detectChanges();

                const table = $('table#accessory');
                table.footable();
            }

        })
    }

}
