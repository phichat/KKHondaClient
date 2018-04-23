import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  // styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  private mcAmount: number = 1;
  private accAmount: number = 5;
  private deposit: number = 5000;
  private price: number = 48000;
  private discount: number = 1000;
  private vat: number = 2000;
  private totalPrice: number = 49000;

  constructor() { }

  ngOnInit() {
  }

}
