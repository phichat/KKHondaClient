import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BookingService } from './booking.service';
import { BookingPaymentTypeModel } from './BookingPaymentType.model';
import { BookingType } from './bookingType.model';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { BookingDetailModel } from './bookingDetail.model';

@Component({
   selector: 'app-booking',
   templateUrl: './booking.component.html',
   styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, AfterViewInit {


   dataTable: any;

   public color: any = ['#1ab394', '#1C84C6', '#FCC918'];
   public legends = [
      { name: 'จอง', color: this.color[0] },
      { name: 'ขาย', color: this.color[1] },
      { name: 'ยกเลิก', color: this.color[2] },
   ];
   public xaxisTricks = [[0, 'dd']];
   public flotDataset: Array<any> = [[0, 0]]

   public flotOptions: any =
      {
         series: {
            lines: {
               show: false,
               fill: true
            },
            splines: {
               show: true,
               tension: 0.4,
               lineWidth: 1,
               fill: 0.4
            },
            points: {
               radius: 0,
               show: true
            },
            shadowSize: 2
         },
         grid: {
            hoverable: true,
            clickable: true,
            show: true,
            borderWidth: 2,
            color: 'transparent'
         },
         colors: this.color,
         xaxis: {
            ticks: this.xaxisTricks
         },
         yaxis: {
            borderWidth: 1,
         },
         tooltip: false
      };

   public bookingPayMentType: BookingPaymentTypeModel[];
   public bookingType: BookingType[];
   public bookingDetail: BookingDetailModel[];

   constructor(private dashBookingService: BookingService, private chRef: ChangeDetectorRef) { }

   async ngOnInit() {
      const date = new Date(), y = date.getFullYear(), m = date.getMonth();
      const startDate = (new Date(2018, 1, 5)).toISOString();
      const endDate = (new Date()).toISOString();

      await this.dashBookingService.GetByCon(startDate, endDate).subscribe(res => {
         this.bookingDetail = res.bookingDetail;
         this.RenderChart(res);
         this.onDetectTable();
      });
   }

   ngAfterViewInit(): void {

   }

   async onSubmit(value: any) {

      await this.dashBookingService.GetByCon(value.startDate, value.endDate).subscribe(res => {
         this.bookingDetail = res.bookingDetail;
         this.RenderChart(res);
      });
   }

   private RenderChart(res: any) {
      let _booking: any[] = [];
      let _sell: any[] = [];
      let _cancel: any[] = [];

      res.bookingType
         .filter((item: BookingType) => item.bookingType == 1)
         .map((item: BookingType, i) => {
            _booking.push([i, item.itemAmount])
         })


      res.bookingType
         .filter((item: BookingType) => item.bookingType == 2)
         .map((item: BookingType, i) => _sell.push([i, item.itemAmount]))

      res.bookingType
         .filter((item: BookingType) => item.bookingType == 9)
         .map((item: BookingType, i) => _cancel.push([i, item.itemAmount]))


      let result = [...res.bookingType.map(item => item.branchName)];
      result = result.sort().reduce((accumulator, current) => {
         const length = accumulator.length
         if (length === 0 || accumulator[length - 1] !== current) {
            accumulator.push(current);
         }
         return accumulator;
      }, [])

      let _xaxisTricks = []
      result.map((item, i) => {
         _xaxisTricks.push([i, item])
      })

      this.xaxisTricks = _xaxisTricks;

      this.flotDataset = [_booking, _sell, _cancel];
   }

    onDetectTable() {

      const table: any = $('#bookingDetail');

      if ($.fn.DataTable.isDataTable('#bookingDetail')) {
         this.dataTable = table.DataTable();
         this.dataTable.destroy();
      }

       this.chRef.detectChanges();

      this.dataTable = $('#bookingDetail').DataTable({
         'scrollX': true,
         'scrollY': true
      });

   }

}
