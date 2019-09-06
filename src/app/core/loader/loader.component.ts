import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { LoaderService } from './loader.service';
import { LoaderState } from './loader-state';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

    show: Observable<boolean>;
  
    constructor(
      private loaderService: LoaderService
    ) { }
  
    ngOnInit() {
      this.show = this.loaderService.loaderState.pipe(map(x => x.show));
    }
}