import { Component, OnInit } from '@angular/core';
import { appConfig } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { TagConFormConfig } from './tag-con-form.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tag-con-form-detail',
  templateUrl: './tag-con-form-detail.component.html'
})
export class TagConFormDetailComponent extends TagConFormConfig implements OnInit {

  constructor(
    private http: HttpClient,
    private s_loader: LoaderService
  ) {
    super()
  }

  ngOnInit() {
   
  }

}
