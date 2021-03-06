import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { setZeroHours } from 'app/app.config';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { TagSedConfig } from './tag-sed.config';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'app/core/loader/loader.service';
import { CarRegisService, SedRegisService } from 'app/services/ris';

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
    private s_user: UserService,
    private chRef: ChangeDetectorRef,
    private s_loader: LoaderService,
    private s_carRegis: CarRegisService,
    private s_sedRegis: SedRegisService
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
    this.mUser = this.s_user.cookies;
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      createDate: new FormControl(null, Validators.required),
      createBy: new FormControl(null),
      updateDate: new FormControl(new Date()),
      updateBy: new FormControl(null),
      branchId: new FormControl(null),
      totalPrice: new FormControl(0),
      price1: new FormControl(0),
      vatPrice1: new FormControl(0),
      netPrice1: new FormControl(0),
      price2: new FormControl(0),
      price2Remain: new FormControl(0),
      borrowMoney: new FormControl(null, Validators.required),
      status: new FormControl(0),
      conList: this.fb.array([]),
      sedNo: new FormControl(null),
      remark: new FormControl(null),
    });

    this.loadingConList();

    this.ConList.valueChanges.subscribe((o: any[]) => {
      this.checkedAll = o.filter(x => x['IS_CHECKED'] == false).length ? false : true;
    })
  }

  checkAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.ConList.value.length; index++) {
      this.ConList.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }
  }

  loadingConList() {

    this.s_carRegis.CarRegisReceiveTag().subscribe((x: any[]) => {
      if (x.length == 0) {
        this.loading = 1;
        while (this.ConList.length) {
          this.ConList.removeAt(0);
        }
        return;
      }
      const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false }], []);
      this.setItemFormArray(res, this.formGroup, 'conList');
      this.chRef.markForCheck();

      this.ConList.valueChanges.subscribe((x: any[]) => {
        const price = x.filter(o => o.IS_CHECKED);
        const totalPrice = price.reduce((a, c) => a += (c.price1 + c.vatPrice1 + c.price2), 0);
        const price1 = price.reduce((a, c) => a += c.price1, 0);
        const vatPrice1 = price.reduce((a, c) => a += c.vatPrice1, 0);
        const netPrice1 = price1 + vatPrice1;
        const price2 = price.reduce((a, c) => a += c.price2, 0);
        this.formGroup.patchValue({
          totalPrice: totalPrice,
          price1: price1,
          price2: price2,
          vatPrice1: vatPrice1,
          netPrice1: netPrice1,
          // price2Remain: price2,
          borrowMoney: price2,
          createBy: this.mUser.id,
          // createDate: new Date(),
          branchId: this.mUser.branch,
          status: 0
        });
      });

      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });
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
    f.createDate = setZeroHours(f.createDate);
    f.price2Remain = f.borrowMoney;
    f.conList = this.ConListIsSelect.reduce((a, c) => [...a, c.bookingNo], []).join(',');

    this.s_loader.showLoader();
    this.s_sedRegis.Post(f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      this.checkedAll = false;
      toastr.success(message.created);
      this.formGroup.reset();

      this.loadingConList();

    }, () => toastr.error(message.failed));

  }
}
