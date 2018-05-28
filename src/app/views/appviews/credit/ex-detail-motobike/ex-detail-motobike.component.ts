import { Component, OnInit } from '@angular/core';
import { BookingModel, BookingItemModel } from '../../../../models/selling';
import { BookingService } from '../../../../services/selling';

@Component({
  selector: 'app-ex-detail-motobike',
  templateUrl: './ex-detail-motobike.component.html'
})
export class ExDetailMotobikeComponent implements OnInit {

  modelBooking = new BookingModel();
  modelMotobike = new BookingItemModel();
  constructor(private _bookingService: BookingService) { }

  ngOnInit() {
    this._bookingService.currentData.subscribe(o => {
      this.modelBooking = o;
    });
  }

}
