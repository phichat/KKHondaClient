import { Component, OnInit, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class  PageloaderService {
  showPageloader = new BehaviorSubject<Boolean>(false);

  constructor() { }

  public showLoading() {
    this.setShowPageloader(true);
  }

  public endLoading() {
    this.setShowPageloader(false);
  }

  setShowPageloader(status: boolean) {
      setTimeout(() => this.showPageloader.next(status), 0);
  }
}

@Component({
  selector: 'app-pageloader',
  templateUrl: './pageloader.component.html',
  styleUrls: ['./pageloader.component.scss']
})
export class PageloaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
