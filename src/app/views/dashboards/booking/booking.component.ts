import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { BookingService } from './booking.service';
import { BookingPaymentTypeModel } from './bookingPaymentType.model';
import { BookingType } from './bookingType.model';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { BookingDetailModel } from './bookingDetail.model';
import { setLocalDate } from 'app/app.config';

@Component({
   selector: 'app-booking',
   templateUrl: './booking.component.html',
   styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, AfterViewInit {

   dataTable: any;
   isUpdateChart: boolean | false;
   setLocalDate = setLocalDate;

   public color: any = ['#1C84C6', '#1ab394', '#ff3333'];
   public legends: any = [];

   public xaxisTricks = [[0, "กระสัง"], [1, "จอหอ"], [2, "ถนนช้างเผือก"], [3, "นางรอง"], [4, "สำนักงานใหญ่"], [5, "สุนทรเทพ"]];
   public flotDataset: Array<any> = []

   public flotOptions = {
      series: {
         points: {
            radius: 0,
            show: true,
            // borderWidth: 0.5,
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
      tooltip: true,
      tooltipOpts: {
         content: "%y คัน"
      }

   };

   public bookingPayMentType: any[] = [];
   public bookingType: BookingType[];
   public bookingDetail: BookingDetailModel[];

   constructor(
      private dashBookingService: BookingService,
      private chRef: ChangeDetectorRef) { }

   ngOnInit() {
      const date = new Date(), y = date.getFullYear(), m = date.getMonth();
      const startDate = (new Date(2018, 1, 5)).toISOString();
      const endDate = (new Date()).toISOString();

      this.dashBookingService.GetByCon(startDate, endDate).subscribe(res => {
         this.chRef.markForCheck();
         this.bookingDetail = res.bookingDetail;
         this.RenderChart(res);
      });
   }

   ngAfterViewInit(): void {

   }

   onSubmit(value: any) {
      value.startDate = (new Date(value.startDate)).toISOString();
      value.endDate = (new Date(value.endDate)).toISOString();

      this.dashBookingService.GetByCon(value.startDate, value.endDate).subscribe(res => {
         this.bookingDetail = res.bookingDetail;
         this.RenderChart(res);
      });
   }

   private RenderChart(res: any) {
      let _booking: any[] = [];
      let _sell: any[] = [];
      let _cancel: any[] = [];

      let totalBooking = 0;
      let totalSell = 0;
      let totalCancel = 0;

      let totalPriceBooking = 0;
      let totalPriceSell = 0;
      let totalPriceCancel = 0;

      res.bookingType
         .filter((item: BookingType) => item.bookingType == 1)
         .map((item: BookingType, i) => {
            _booking.push([i, item.itemAmount]);
            totalBooking += item.itemAmount;
            totalPriceBooking += item.bookingSellPrice;
         })


      res.bookingType
         .filter((item: BookingType) => item.bookingType == 2)
         .map((item: BookingType, i) => {
            _sell.push([i, item.itemAmount])
            totalSell += item.itemAmount;
            totalPriceSell += item.bookingSellPrice;
         })

      res.bookingType
         .filter((item: BookingType) => item.bookingType == 9)
         .map((item: BookingType, i) => {
            _cancel.push([i, item.itemAmount])
            totalCancel += item.itemAmount;
            totalPriceCancel += item.bookingSellPrice;
         })


      let totalCash = 0;
      let totalLeasing = 0;
      let totalCredit = 0;
      let totalCredit2 = 0;
      let totalPriceCash = 0;
      let totalPriceLeasing = 0;
      let totalPriceCredit = 0;
      let totalPriceCredit2 = 0;

      res.bookingPayMentType.filter((item) => item.bookingPaymentType == 1)
         .map((item: BookingPaymentTypeModel) => {
            totalCash += item.itemAmount;
            totalPriceCash += item.bookSellPrice;
         })

      res.bookingPayMentType.filter((item) => item.bookingPaymentType == 2)
         .map((item: BookingPaymentTypeModel) => {
            totalLeasing += item.itemAmount;
            totalPriceLeasing += item.bookSellPrice;
         })

      res.bookingPayMentType.filter((item) => item.bookingPaymentType == 3)
         .map((item: BookingPaymentTypeModel) => {
            totalCredit += item.itemAmount;
            totalPriceCredit += item.bookSellPrice;
         })

      res.bookingPayMentType.filter((item) => item.bookingPaymentType == 4)
         .map((item: BookingPaymentTypeModel) => {
            totalCredit2 += item.itemAmount;
            totalPriceCredit2 += item.bookSellPrice;
         })

      let result = [...res.bookingType.map(item => item.branchName)];
      let _xaxisTricks = result.sort().reduce((accumulator, current, index) => {
         const length = accumulator.length
         if (length === 0 || accumulator[length - 1] !== current) {
            accumulator.push([index, current]);
         }
         return accumulator;
      }, [])

      // let _xaxisTricks = []
      // result.map((item, i) => {
      //    _xaxisTricks.push([i, item])
      // })

      this.xaxisTricks = _xaxisTricks;

      console.log(_xaxisTricks);
      
      this.flotOptions.xaxis.ticks = _xaxisTricks;

      this.flotDataset = [
         {
            data: _booking,
            splines: {
               show: true,
               tension: 0.4,
               lineWidth: 1,
               fill: 0.4
            },
         },
         {
            data: _sell,
            splines: {
               show: true,
               tension: 0.4,
               lineWidth: 1,
               fill: 0.4
            },
         },
         {
            data: _cancel,
            lines: {
               show: true,
               fill: false
            },
         }
      ];

      this.legends = [
         { name: 'จอง', color: this.color[0], itemAmount: totalBooking, totalPrice: totalPriceBooking },
         { name: 'ขาย', color: this.color[1], itemAmount: totalSell, totalPrice: totalPriceSell },
         { name: 'ยกเลิก', color: this.color[2], itemAmount: totalCancel, totalPrice: totalPriceCancel }
      ]

      this.bookingPayMentType = [
         { name: 'เงินสด', itemAmount: totalCash, totalPrice: totalPriceCash },
         { name: 'สินเชื่อ', itemAmount: totalLeasing, totalPrice: totalPriceLeasing },
         { name: 'เช่าซื้อ', itemAmount: totalCredit, totalPrice: totalPriceCredit },
         { name: 'ขายเชื่อ', itemAmount: totalCredit2, totalPrice: totalPriceCredit2 }
      ]

      this.onDetectTable();

      this.chRef.detectChanges();
   }

   private reduceArray(array: any[]) {
      return array.sort().reduce((accumulator, current) => {
         const length = accumulator.length
         if (length === 0 || accumulator[length - 1] !== current) {
            accumulator.push(current);
         }
         return accumulator;
      }, [])
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
