import { Component, OnInit } from '@angular/core';
import { ModelCustomer } from '../../../models/model-customer';

@Component({
  selector: 'app-modal-customer',
  templateUrl: './modal-customer.component.html',
  styleUrls: ['./modal-customer.component.css']
})
export class ModalCustomerComponent implements OnInit {

  public model = new ModelCustomer('', '', '', '', '', '', '', '');

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {
    // console.log(this.model);
  }

}
