import { Component, OnInit } from '@angular/core';
import ModelCredit from '../../../../models/selling/model-credit';
import { SellActivityService } from '../../../../services/selling';
import { SellActivity } from '../../../../models/selling';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit {

  model = new ModelCredit();
  path: string;
  modelSellActivity = new Array<SellActivity>();

  instalment = [
    { value: 3, text: '3 เดือน' },
    { value: 6, text: '6 เดือน' },
    { value: 9, text: '9 เดือน' }
  ];

  constructor(
    private _sellActivityService: SellActivityService,
    private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    for (let i = 1; i < 7; i++) {
      let month = i * 12;
      this.instalment.push({ value: month, text: `${month} เดือน(${i} ปี)` });
    }

    this._activatedRoute.snapshot.url.map(p => this.path = p.path);

    this.onLoadSellActivity();
  }

  onLoadSellActivity() {
    this._sellActivityService.getAll().subscribe(p => {
      this.modelSellActivity = p.filter(pp => pp.sellTypeId !== 1 && pp.sellTypeId !== 2);
    });
  }

}
