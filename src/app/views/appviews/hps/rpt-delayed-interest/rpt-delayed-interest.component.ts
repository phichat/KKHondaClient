import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DelayedInterestModel } from '../../../../models/credit/delayed-interest.model';

@Component({
    selector: 'app-rpt-delayed-interest',
    templateUrl: './rpt-delayed-interest.component.html'
})
export class RptDelayedInterestComponent implements OnInit, OnChanges {

    @Input() delayedInterest = new Array<DelayedInterestModel>()

    totalFineSum = 0;
    totalPayFineSum = 0;
    totalOutstanding = 0;

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.delayedInterest.length) {
            this.delayedInterest.map(item => {
                this.totalFineSum += item.fineSum;
                this.totalOutstanding += item.outstanding;
                this.totalPayFineSum += item.payFineSum;
            })
        }
    }

}
