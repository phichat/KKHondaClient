import { Component, OnInit, OnDestroy } from '@angular/core';
import { appConfig } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { TagClListConfig } from './tag-cl-list.config';


@Component({
  selector: 'app-tag-cl-list',
  templateUrl: './tag-cl-list.component.html',
  styleUrls: ['./tag-cl-list.component.scss']
})
export class TagClListComponent extends TagClListConfig implements OnInit, OnDestroy {
  
  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit() {
    const sedList = `${appConfig.apiUrl}/Ris/Cl/All`;

    this.http.get(sedList).subscribe((x: any[]) => {
      if (!x.length) {
        this.loading = 1;
        return;
      };
      this.clList = x;
      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });
  }
}
