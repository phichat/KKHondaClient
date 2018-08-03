import { Component, OnInit, Input } from '@angular/core';
import { CutOffSaleModel } from '../../../../models/credit/cut-off-sale.model';

@Component({
    selector: 'app-rpt-cut-off-sale',
    templateUrl: './rpt-cut-off-sale.component.html'
})
export class RptCutOffSaleComponent implements OnInit {

    @Input() cutOffSale = new CutOffSaleModel();

    constructor() { }

    ngOnInit() {
    }

}
