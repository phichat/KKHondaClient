import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { TagClListConfig } from './tag-con-list.config';

@Component({
  selector: 'app-tag-con-list',
  templateUrl: './tag-con-list.component.html',
  styleUrls: ['./tag-con-list.component.scss']
})
export class TagConListComponent extends TagClListConfig implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private http: HttpClient
  ) {
    super()
   }

  ngOnInit() {
    const url = `${appConfig.apiUrl}/Ris/All`
    this.http.get(url).subscribe((x: any[]) => {
      if (!x.length) {
        this.loading = 1;
        return;
      };
      this.conList = x;

      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });
  }

}
