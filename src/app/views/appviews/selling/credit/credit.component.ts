import { Component, OnInit, Input, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { SellActivityService, SellingService } from '../../../../services/selling';
import { SellActivity, ModelCredit } from '../../../../models/selling';
import { ActivatedRoute } from '@angular/router';
import { MotobikeComponent } from '../motobike/motobike.component';
import * as moment from 'moment';
// import 'moment/locale/pt-br';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit {

  model = new ModelCredit();
  path: string;
  modelSellActivity = new Array<SellActivity>();
  sellType = [
    { value: 3, text: 'ลิสซิ่ง' },
    { value: 4, text: 'เช่าซื้อ' }]

  instalmentEnd = [
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
      this.instalmentEnd.push({ value: month, text: `${month} เดือน(${i} ปี)` });
    }
    this.model.deposit = 0;
    this.model.depositPrice = 0;
    this.model.dueDate = (new Date).getDate();
    this.model.firstPayment = moment().format('YYYY-MM-DD');
    this.model.instalmentEnd = null;
    this.model.instalmentPrice = 0;
    this.model.interest = 0;
    this.model.nowVat = 7;
    this.model.remain = 0;
    this.model.sellType = 4;
    this._activatedRoute.snapshot.url.map(p => this.path = p.path);

    this.onChangeSellActivity();

    this.instalmentCalculate();
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

  instalmentCalculate() {
    this._sellingService.currentData.subscribe(p => {
     
      // เงินดาวน์ (บาท)
      // มูลค่าสินค้า * เงินดาวน์(%)
      this.model.depositPrice = p.totalSellNet * (this.model.deposit / 100);

      // คงเหลือ/ยอดจัด
      // มูลค่าสินค้า - เงินดาวน์(บาท)
      this.model.remain = p.totalSellNet - this.model.depositPrice;

      // ค่างวด
      // (ยอดคงเหลือ / จำนวนงวด) * (ดอกเบี้ยต่อปี (% --> บาท))
      this.model.instalmentPrice = (this.model.remain / this.model.instalmentEnd) * (1 + (this.model.interest / 100))


    })
  }
}
