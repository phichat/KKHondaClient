import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { DiscountModel } from '../../../../models/credit/discount.model';

@Component({
	selector: 'app-rpt-discount-term',
	templateUrl: './rpt-discount-term.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RptDiscountTermComponent implements OnInit, OnChanges {

	@Input() discount = new Array<DiscountModel>()

	totalDist = 0;
	totalUseDist = 0;
	totalDistOutstanding = 0;

	constructor() { }

	ngOnInit() {
	}

	ngOnChanges() {
		if (this.discount.length) {
			this.discount.map(item => {				
				this.totalDistOutstanding += item.discount;
				this.totalUseDist += item.useDiscount;				
			});

			this.totalDist += this.totalDistOutstanding + this.totalUseDist;
		}
	}
}
