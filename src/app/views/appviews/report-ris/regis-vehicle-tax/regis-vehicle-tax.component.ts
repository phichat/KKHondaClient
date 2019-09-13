import { Component, OnInit } from '@angular/core';
import { MyDatePickerOptions } from 'app/app.config';

@Component({
  selector: 'app-regis-vehicle-tax',
  templateUrl: './regis-vehicle-tax.component.html',
  styleUrls: ['./regis-vehicle-tax.component.scss']
})
export class RegisVehicleTaxComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public myDatePickerOptions = MyDatePickerOptions;
}
