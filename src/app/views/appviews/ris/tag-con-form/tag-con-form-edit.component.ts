import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TagConFormConfig } from './tag-con-form.config';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'app/core/loader/loader.service';

@Component({
  selector: 'app-tag-con-form-edit',
  templateUrl: './tag-con-form-edit.component.html',
  styleUrls: ['./tag-con-form.component.scss']
})
export class TagConFormEditComponent extends TagConFormConfig implements OnInit {

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private s_loader: LoaderService,
    private chRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute
  ) {
    super()
  }

  ngOnInit() {
    this.s_loader.showLoader();

    this.formGroup = this.fb.group({
      bookingNo: new FormControl(null),
      bookingStatus: new FormControl(null),
      createDate: new FormControl(new Date()),
      createBy: new FormControl(null),
      updateDate: new FormControl(null),
      updateBy: new FormControl(null),
      branchId: new FormControl(null),
      reasonCode: new FormControl(null),
      eNo: new FormControl(null),
      fNo: new FormControl(null),
      price1: new FormControl(null),
      vatPrice1: new FormControl(null),
      price2: new FormControl(null),
      totalPrice: new FormControl(null)
    })

    // this.ListItem$.subscribe(x => {
    //   this.chRef.markForCheck();
    //   const price1 = x.reduce((a, c) => a += c.itemPrice1, 0);
    //   const price2 = x.reduce((a, c) => a += c.itemPrice2, 0);
    //   const totalPrice = price1 + price2;
    //   const vatPrice1 = x.reduce((a, c) => a += c.itemVatPrice1, 0);
    //   this.formGroup.patchValue({
    //     price1: price1,
    //     price2: price2,
    //     vatPrice1: vatPrice1,
    //     totalPrice: totalPrice
    //   })
    //   this.chRef.detectChanges();
    // });

   
  }

  onSubmit() {

  }
}
