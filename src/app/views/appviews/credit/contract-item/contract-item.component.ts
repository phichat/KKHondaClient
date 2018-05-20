import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CalculateModel } from '../../../../models/credit';

@Component({
  selector: 'app-contract-item',
  templateUrl: './contract-item.component.html',
  styleUrls: ['./contract-item.component.scss']
})
export class ContractItemComponent implements OnInit {

  @Input() inputCalModel: EventEmitter<CalculateModel>;
  constructor() { }

  ngOnInit() {
    console.log(this.inputCalModel);
  }

}
