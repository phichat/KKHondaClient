import { Component, OnInit } from '@angular/core';
import { detectBody } from '../../../app.helpers';

declare var jQuery: any;

@Component({
  selector: 'basic',
  templateUrl: 'basicLayout.template.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class BasicLayoutComponent implements OnInit {

  ngOnInit() {
    detectBody();
    
  }

  public onResize() {
    detectBody();
  }

}
