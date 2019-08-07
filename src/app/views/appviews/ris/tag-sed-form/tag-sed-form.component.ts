import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import { TagSedConfig } from './tag-sed.config';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'app/core/loader/loader.service';

declare var toastr: any;
@Component({
  selector: 'app-tag-sed-form',
  templateUrl: './tag-sed-form.component.html',
  styleUrls: ['./tag-sed-form.component.scss']
})
export class TagSedFormComponent extends TagSedConfig implements OnInit {

  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private s_user: UserService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private s_loader: LoaderService
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      createDate: new FormControl(new Date()),
      createBy: new FormControl(null),
      updateDate: new FormControl(new Date()),
      updateBy: new FormControl(null),
      branchId: new FormControl(null),
      totalPrice: new FormControl(0),
      price1: new FormControl(0),
      price2: new FormControl(0),
      price2Remain: new FormControl(0),
      borrowMoney: new FormControl(null, Validators.required),
      status: new FormControl(0),
      conList: this.fb.array([]),
      sedNo: new FormControl(null)
    });

    const apiURL = `${appConfig.apiUrl}/Ris/CarRegisReceive`;
    this.http.get(apiURL).subscribe((x: any[]) => {
      if (x.length == 0) {
        this.loading = 1;
        return;
      }
      const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false }], []);
      this.setItemFormArray(res, this.formGroup, 'conList');
      this.chRef.markForCheck();

      this.ConList.valueChanges.subscribe((x: any[]) => {
        const price = x.filter(o => o.IS_CHECKED);
        const totalPrice = price.reduce((a, c) => a += (c.price1 + c.price2), 0);
        const price1 = price.reduce((a, c) => a += c.price1, 0);
        const price2 = price.reduce((a, c) => a += c.price2, 0);
        this.formGroup.patchValue({
          totalPrice: totalPrice,
          price1: price1,
          price2: price2,
          price2Remain: price2,
          borrowMoney: price2
        });
      });

      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.mUser = x;
      this.formGroup.patchValue({
        createBy: x.id,
        branchId: x.branch
      });
      this.chRef.detectChanges();
    });

  }

  checkAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.ConList.value.length; index++) {
      this.ConList.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  onSubmit() {
    let f = { ...this.formGroup.value };
    f.createDate = (<Date>f.createDate).toISOString();
    f.conList = this.ConListIsSelect.reduce((a, c) => [...a, c.bookingNo], []).join(',');
    this.s_loader.showLoader();
    const url = `${appConfig.apiUrl}/Ris/Sed`;
    this.http.post(url, f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      this.router.navigate(['ris/al-form-create']);
    }, () => toastr.error(message.failed));

  }
}
