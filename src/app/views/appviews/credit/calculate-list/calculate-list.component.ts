import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookingListInterface } from '../../../../interfaces/sellings';
import { BookingListModel } from 'app/models/selling';
import { BookingService } from '../../../../services/selling';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { Router } from '@angular/router';

@Component({
   selector: 'app-calculate-list',
   templateUrl: './calculate-list.component.html',
   styleUrls: ['./calculate-list.component.scss']
})

export class CalculateListComponent implements BookingListInterface, OnInit {

   BookingList: BookingListModel[];

   // Our future instance of DataTable
   dataTable: any;

   constructor(
      private bookService: BookingService,
      private chRef: ChangeDetectorRef,
      private router: Router
   ) { };

   ngOnInit(): void {
      this.bookService.get().subscribe(p => {
         this.BookingList = p;

         this.chRef.detectChanges();

         const table: any = $('table');
         this.dataTable = table.DataTable({
            'scrollX': true
         });
      })
   }

   nextClculate(bookId: number) {
      this.router.navigate(['credit/calculate'], { queryParams: { bookingId: bookId } })
   }
}
