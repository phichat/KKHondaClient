import { Component, OnInit, Input } from '@angular/core';
import { DelayedInterestModel } from '../../../../models/credit/delayed-interest.model';

@Component({
  selector: 'app-rpt-delayed-interest',
  templateUrl: './rpt-delayed-interest.component.html'
})
export class RptDelayedInterestComponent implements OnInit {

  @Input() delayedInterest = new Array<DelayedInterestModel>()

  constructor() { }

  ngOnInit() {
  }

}
