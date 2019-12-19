import { Component, OnInit } from '@angular/core';
import { MyDatePickerOptions, appConfig, setZeroHours } from 'app/app.config';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-regis-tag-second-hand',
  templateUrl: './regis-tag-second-hand.component.html',
  styleUrls: ['./regis-tag-second-hand.component.scss']
})
export class RegisTagSecondHandComponent implements OnInit {

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

  onSubmit() {
    let f = { ...this.formGroup.value };

    f.sDate = setZeroHours(f.sDate) || '';
    f.eDate = setZeroHours(f.eDate) || '';
    f.paymentType = f.paymentType || 0;

    const url = `${appConfig.reportUrl}/RIS/index.aspx?paymentType=${f.paymentType}&sDate=${f.sDate}&eDate=${f.eDate}&formRegisTagSecondHand=true`;
    window.open(url, '_blank');

  }

  // onSubmit() {
  //   let f = { ...this.formGroup.value };
  //   f.sDate = setZeroHours(f.sDate);
  //   f.eDate = setZeroHours(f.eDate);
  //   const url = `${appConfig.reportUrl}/RIS/index.aspx?sDate=${f.sDate}&eDate=${f.eDate}&formRegisTagSecondHand=true`;
  //   window.open(url, '_blank');
  // }
}
