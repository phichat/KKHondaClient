import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModelCustomer, ModelProduct, ModelCredit } from '../../../models/selling';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { MotobikeComponent } from './motobike/motobike.component';
import { SummaryComponent } from './summary/summary.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { AccessoryComponent } from './accessory/accessory.component';
import { CreditComponent } from './credit/credit.component';

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.scss']
})
export class SellingComponent implements OnInit, AfterViewInit {

  modelCustomer: ModelCustomer;
  modelMotobike: ModelProduct;
  modelAccessory: ModelProduct;
  modelFinancial: ModelCredit;

  @ViewChild(BookingDetailComponent) bookingDetailCom;
  @ViewChild(SummaryComponent) summaryCom;
  @ViewChild(MotobikeComponent) motobikeCom;
  @ViewChild(AccessoryComponent) accessoryCom;
  @ViewChild(CreditComponent) creditCom;

  constructor(
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  submit() {
    console.log(this.motobikeCom.model);
  }

}
