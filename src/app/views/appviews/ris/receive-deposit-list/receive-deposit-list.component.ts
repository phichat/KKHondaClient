import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receive-deposit-list',
  templateUrl: './receive-deposit-list.component.html',
  styleUrls: ['./receive-deposit-list.component.scss']
})
export class ReceiveDepositListComponent implements OnInit {

  constructor() { }

  loading: number;
  list: any[] = [];

  ngOnInit() {
  }

}
