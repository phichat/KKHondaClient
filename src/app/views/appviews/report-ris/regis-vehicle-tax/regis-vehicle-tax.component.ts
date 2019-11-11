import { Component, OnInit } from '@angular/core';
import { MyDatePickerOptions, getDateMyDatepicker, appConfig, setZeroHours } from 'app/app.config';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-regis-vehicle-tax',
  templateUrl: './regis-vehicle-tax.component.html',
  styleUrls: ['./regis-vehicle-tax.component.scss']
})
export class RegisVehicleTaxComponent implements OnInit {

  constructor(
    private fb: FormBuilder
  ) {
   }

  formGroup: FormGroup;

  ngOnInit() {
    this.formGroup = this.fb.group({
      sDate: new FormControl(null, Validators.required),
      eDate: new FormControl(null, Validators.required)
    })
  }

  public myDatePickerOptions = MyDatePickerOptions;

  onSubmit() {
    let f = { ...this.formGroup.value };
    f.sDate = setZeroHours(f.sDate);
    f.eDate = setZeroHours(f.eDate);
    const url = `${appConfig.reportUrl}/RIS/index.aspx?sDate=${f.sDate}&eDate=${f.eDate}&formRegisVehicleTax=true`;
    window.open(url, '_blank');
  }
}
