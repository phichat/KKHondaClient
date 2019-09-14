import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MyDatePickerOptions, getDateMyDatepicker, setZeroHours, appConfig } from 'app/app.config';

@Component({
  selector: 'app-regis-tag',
  templateUrl: './regis-tag.component.html',
  styleUrls: ['./regis-tag.component.scss']
})
export class RegisTagComponent implements OnInit {

  constructor(
    private fb: FormBuilder
  ) { }

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
    f.sDate = setZeroHours(getDateMyDatepicker(f.sDate));
    f.eDate = setZeroHours(getDateMyDatepicker(f.eDate));
    const url = `${appConfig.reportUrl}/RIS/index.aspx?sDate=${f.sDate}&eDate=${f.eDate}&formRegisTag=true`;
    window.open(url, '_blank');
  }

}
