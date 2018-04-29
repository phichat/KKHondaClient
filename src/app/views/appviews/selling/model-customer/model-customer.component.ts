import { Component, OnInit } from '@angular/core';
import { ModelCustomer } from '../../../../models';

@Component({
  selector: 'app-model-customer',
  templateUrl: './model-customer.component.html',
  styleUrls: ['./model-customer.component.scss']
})
export class ModelCustomerComponent implements OnInit {

  public model = new ModelCustomer('', '', '', '', '', '', '', '');
  title: string;

  constructor() {
    this.title = 'ค้นหาข้อลูกค้า';
  }

  ngOnInit() {
  }

  onSubmit() {
    // console.log(this.model);
  }

}
