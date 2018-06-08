import { Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, AfterContentChecked } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-page-load-warpper',
  templateUrl: './page-load-warpper.component.html',
  styleUrls: ['./page-load-warpper.component.scss']
})
export class PageLoadWarpperComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // setTimeout(() => {
      // jQuery('.page-loader-wrapper').addClass('animated fadeOutRight');

      // setTimeout(() => {
      //   jQuery('.page-loader-wrapper')
      //     .css('display', 'none')
      // }, 500);

    // }, 500);
  }

}
