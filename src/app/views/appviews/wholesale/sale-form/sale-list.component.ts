import { Component, OnInit } from '@angular/core';
import { setLocalDate } from 'app/app.config';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sale-list',
  templateUrl: 'sale-list.component.html'
})

export class SaleListComponent implements OnInit {
  setLocalDate = setLocalDate;
  saleList: any[] = [];
  formSearch: FormGroup;
  constructor(
    private fb: FormBuilder
  ) {
    this.formSearch = this.fb.group({
      sellNo: new FormControl(null),
      sellDate: new FormControl(null),
      hireName: new FormControl(null),
    })
  }

  ngOnInit() { }

  onSearch() {

  }
}