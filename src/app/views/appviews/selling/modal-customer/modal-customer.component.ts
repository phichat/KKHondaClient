import { Component, OnInit } from '@angular/core';
import { ModelCustomer } from '../../../../models/selling';

@Component({
  selector: 'app-modal-customer',
  templateUrl: './modal-customer.component.html',
  styleUrls: ['./modal-customer.component.scss']
})
export class ModalCustomerComponent implements OnInit {

  model = new ModelCustomer('', '', '', '', '', '', '', '');
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
