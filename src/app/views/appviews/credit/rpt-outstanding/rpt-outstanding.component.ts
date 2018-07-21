import { Component, OnInit, Input } from '@angular/core';
import { Outstanding } from '../../../../models/credit/outstanding-model';

@Component({
  selector: 'app-rpt-outstanding',
  templateUrl: './rpt-outstanding.component.html'
})
export class RptOutstandingComponent implements OnInit {

  @Input() outStanding: Outstanding;

  constructor() { }

  ngOnInit() {
  }

}
