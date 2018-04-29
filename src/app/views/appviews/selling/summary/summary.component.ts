import { Component, OnInit } from '@angular/core';
import { ModelBookingDetail } from '../../../../models';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  modelBooking = new ModelBookingDetail();
  constructor() { }

  ngOnInit() {
  }

}
