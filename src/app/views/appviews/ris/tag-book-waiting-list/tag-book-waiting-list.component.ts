import { Component, OnInit, OnDestroy } from '@angular/core';
import { TagBookWaitingListListConfig } from './tag-book-waiting-list.config';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';

@Component({
  selector: 'app-tag-book-waiting-list',
  templateUrl: './tag-book-waiting-list.component.html',
  styleUrls: ['./tag-book-waiting-list.component.scss']
})
export class TagBookWaitingListComponent extends TagBookWaitingListListConfig implements OnInit, OnDestroy {
  
  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit() {
    const sedList = `${appConfig.apiUrl}/Ris/WaitingTag`;

    this.http.get(sedList).subscribe((x: any[]) => {
      if (!x.length) {
        this.loading = 1;
        return;
      };
      this.waitingList = x;
      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });
  }
}
