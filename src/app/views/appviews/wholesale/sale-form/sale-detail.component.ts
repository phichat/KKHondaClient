import { Component, OnInit } from '@angular/core';
import { SaleFormConfig } from './sale-form.config';

@Component({
  selector: 'app-sale-detail',
  templateUrl: 'sale-detail.component.html'
})

export class SaleDetailComponent extends SaleFormConfig implements OnInit {
  constructor() { 
    super();
  }

  ngOnInit() { }
}