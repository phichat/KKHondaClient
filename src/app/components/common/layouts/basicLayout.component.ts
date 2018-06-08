import { Component, OnInit } from '@angular/core';
import { detectBody } from '../../../app.helpers';
import { PageLoadWarpperService } from '../../../services/common/page-load-warpper.service';

declare var jQuery: any;

@Component({
  selector: 'basic',
  templateUrl: 'basicLayout.template.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class BasicLayoutComponent implements OnInit {

  // onLoadWarpper: boolean;
  // constructor(private pageLoadWarpperService: PageLoadWarpperService) {
  //   this.pageLoadWarpperService.currentData.subscribe(p => {
  //     this.onLoadWarpper = p;
  //   });
  // }

  public ngOnInit(): any {
    detectBody();
  }

  public onResize() {
    detectBody();
  }

}
