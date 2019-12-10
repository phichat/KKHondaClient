import { Component, OnInit, Input, AfterViewInit, DoCheck } from '@angular/core';
import { Outstanding } from '../../../../models/credit/outstanding-model';
import { setLocalDate } from '../../../../app.config';

@Component({
  selector: 'app-rpt-outstanding',
  templateUrl: './rpt-outstanding.component.html'
})
export class RptOutstandingComponent implements OnInit {

  @Input() outStanding: Outstanding;

  constructor() { 
  }

  ngOnInit() {
    
  }


}
