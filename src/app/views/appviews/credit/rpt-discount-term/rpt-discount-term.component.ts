import { Component, OnInit, Input } from '@angular/core';
import { DiscountModel } from '../../../../models/credit/discount.model';

@Component({
  selector: 'app-rpt-discount-term',
  templateUrl: './rpt-discount-term.component.html'
})
export class RptDiscountTermComponent implements OnInit {

  @Input() discount: Array<DiscountModel>

  constructor() { }

  ngOnInit() {
  }

}
