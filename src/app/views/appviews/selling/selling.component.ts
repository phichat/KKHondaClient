import { Component, OnInit } from '@angular/core';
import { ModelCustomer, ModelProduct } from '../../../models/selling';
import ModelCredit from '../../../models/selling/model-credit';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.scss']
})
export class SellingComponent implements OnInit {

  modelCustomer: ModelCustomer;
  modelMotobike: ModelProduct;
  modelAccessory: ModelProduct;
  modelFinancial: ModelCredit;

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  receiveCustomer($event){
    this.modelCustomer = $event;
    console.log($event);
  }

  receiveMotobike($event){
    this.modelMotobike = $event;
  }

  receiveAccessory($event){
    this.modelAccessory = $event;
  }

  receiveFinancial($event){
    this.modelFinancial = $event;
  }

}
