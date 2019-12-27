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
      paymentType: new FormControl('0'),
      // financeChecked: new FormControl({ value: '0', disabled: true }),
      // financeId: new FormControl({ value: null, disabled: true }),
      sellDateChecked: new FormControl('0'),
      sDate: new FormControl({ value: null, disabled: true }),
      eDate: new FormControl({ value: null, disabled: true })
    });

    this.formGroup.get('sellDateChecked').valueChanges.subscribe(x => {
      if (x == '0') {
        this.formGroup.get('sDate').disable();
        this.formGroup.get('eDate').disable();
      } else {
        this.formGroup.get('sDate').enable();
        this.formGroup.get('eDate').enable();
      }
    })

    // this.formGroup.get('paymentType').valueChanges.subscribe(x => {
    //   if (x !== '2') {
    //     this.formGroup.get('financeChecked').disable();
    //   } else {
    //     this.formGroup.get('financeChecked').enable();
    //   }
    // })

    this.formGroup.get('financeChecked').valueChanges.subscribe(x => {
      if (x == '0') {
        this.formGroup.get('financeId').disable();
      } else {
        this.formGroup.get('financeId').enable();
      }
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
