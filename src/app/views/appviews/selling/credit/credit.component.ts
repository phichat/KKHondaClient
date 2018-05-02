import { Component, OnInit, Input, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { SellActivityService, SellingService } from '../../../../services/selling';
import { SellActivity, ModelCredit } from '../../../../models/selling';
import { ActivatedRoute } from '@angular/router';
import { MotobikeComponent } from '../motobike/motobike.component';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit, OnChanges {

  model = new ModelCredit();
  path: string;
  modelSellActivity = new Array<SellActivity>();
  sellType = [
    { value: 3, text: 'ลิสซิ่ง' },
    { value: 4, text: 'เช่าซื้อ' }]

  instalment = [
    { value: 3, text: '3 เดือน' },
    { value: 6, text: '6 เดือน' },
    { value: 9, text: '9 เดือน' }
  ];

  // @ViewChild(MotobikeComponent) motobikeCom;
  constructor(
    private _sellActivityService: SellActivityService,
    private _activatedRoute: ActivatedRoute,
    private _sellingService: SellingService
  ) {
  }

  ngOnInit() {
    for (let i = 1; i < 7; i++) {
      const month = i * 12;
      this.instalment.push({ value: month, text: `${month} เดือน(${i} ปี)` });
    }
    this.model.sellType = 4;
    this._activatedRoute.snapshot.url.map(p => this.path = p.path);

    this.onChangeSellActivity();

    this.calculateInstalment();
  }

  ngOnChanges() {
    this._sellingService.currentData.subscribe(p => {
      console.log(p.totalSellNet);
    })
  }

  onChangeSellActivity() {
    this._sellActivityService
      .filterByKey(this.model.sellType.toString())
      .subscribe(p => {
        this.modelSellActivity = p;
        if (this.model.sellType === 4) {
          this.model.sellAcitvityId = 25;
        } else {
          this.model.sellAcitvityId = null;
        }
      });

  }

  calculateInstalment() {
    this._sellingService.currentData.subscribe(p => {
      this.model.remain = p.totalSellNet;
      console.log(p.totalSellNet);
    })
  }

}
