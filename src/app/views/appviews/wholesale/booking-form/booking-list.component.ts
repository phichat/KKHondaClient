import { Component, OnInit } from '@angular/core';
import { setLocalDate, leftPad } from 'app/app.config';
import { oLanguage } from 'app/components/datatables';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-booking-list',
  templateUrl: 'booking-list.component.html'
})

export class BookingListComponent implements OnInit {
  bookingList: any[] = [];
  setLocalDate = setLocalDate;
  dataTable: any;
  formSearch: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.formSearch = this.fb.group({
      bookingNo: new FormControl(null),
      bookingDate: new FormControl(null),
      receiveDate: new FormControl(null),
      customer: new FormControl(null),
      recipient: new FormControl(null)
    })
  }

  ngOnInit() {
    for (let i = 0; i < 50; i++) {
      this.bookingList.push(
        {
          bookingNo: [`PR${leftPad((i + 1).toString(), 8, '0')}`, `PR${leftPad((i + 2).toString(), 8, '0')}`],
          customerCode: 'CRM-02-0092903',
          customerFullName: 'นายพิเชษฐ ไข่ษรศักดิ์',
          bookingDate: new Date(),
          receiveDate: (new Date()).setDate(10),
          totalBookingPrice: 5000
        }
      )
    }
    this.reInitDatatable();
  }

  onSearch() {

  }

  initDatatable(): void {
    let table: any = $('table.set-dataTable');
    this.dataTable = table.DataTable({
      // dom: '<"row form-group"<"col-12"B>><"row"<"col-md-6"l><"col-md-6"f>>rt<"row"<"col-md-6"i><"col-md-6"p>>',
      oLanguage
    });
  }

  reInitDatatable(): void {
    this.destroyDatatable();
    setTimeout(() => this.initDatatable(), 0)
  }

  destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }
  }
}