import { Component, OnInit } from '@angular/core';
import { ReceiveDepositConfig } from './receive-deposit.config';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CarRegisService } from 'app/services/ris/car-regis.service';
import { InsuranceService } from 'app/services/masters';
import { DropDownModel } from 'app/models/drop-down-model';
import { IPayment } from 'app/interfaces/payment.interface';
import { UserService } from 'app/services/users';
import { tap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ICarRegisClDeposit } from 'app/interfaces/ris';
import { LoaderService } from 'app/core/loader/loader.service';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import { ReceiveDepositService } from 'app/services/ris';

declare var toastr: any;

@Component({
  selector: 'app-receive-deposit-create',
  templateUrl: './receive-deposit-create.component.html',
  styleUrls: ['./receive-deposit-create.component.scss']
})
export class ReceiveDepositCreateComponent extends ReceiveDepositConfig implements OnInit {

  constructor(
    private fb: FormBuilder,
    private s_CarRegis: CarRegisService,
    private s_insur: InsuranceService,
    private s_user: UserService,
    public s_clDeposit: ReceiveDepositService,
    private s_loader: LoaderService,
    private route: Router
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }

    this.mUser = this.s_user.cookies;
    this.formGroup = this.fb.group({
      expenseTag: new FormControl(null, Validators.required),
      insuranceCode: new FormControl(null, Validators.required),
      paymentType: new FormControl('1', Validators.required),
      paymentPrice: new FormControl(null, Validators.required),
      discountPrice: new FormControl(null),
      totalPaymentPrice: new FormControl(null, Validators.required),
      accBankId: new FormControl(null),
      paymentDate: new FormControl(null, Validators.required),
      createBy: new FormControl(this.mUser.id, Validators.required),
      branchId: new FormControl(this.mUser.branch, Validators.required),
      createByName: new FormControl(this.mUser.fullName),
      remark: new FormControl(null),
      conList: this.fb.array([])
    });
  }

  insureDropdown: DropDownModel[];
  formPayment: IPayment;

  get paymentLessThenTotal(): boolean {
    return this.formGroup.get('paymentPrice').value != this.total;
  }

  formPaymentChange(event: IPayment) {
    this.formPayment = event;
    this.formGroup.patchValue({
      paymentPrice: event.paymentPrice,
      discountPrice: event.discountPrice,
      totalPaymentPrice: event.paymentPrice,
      accBankId: event.accBankId,
      paymentDate: event.paymentDate,
      documentRef: event.documentRef
    })
  }

  ngOnInit() {
    // this.loading = this.LoadingEntities.noRecord;
    this.s_insur.Dropdown().subscribe(o => {
      this.insureDropdown = o;
    });

    this.formGroup.get('expenseTag').valueChanges.subscribe((x: string) => {

      let observe: Observable<ICarRegisClDeposit[]>;

      if (x == this.EXPTag.EXP10003) {
        observe = this.s_CarRegis.CarRegisReceiveAct();

      } else if (x == this.EXPTag.EXP10004) {
        observe = this.s_CarRegis.CarRegisReceiveWaranty();
      }

      observe.pipe(
        tap(() => {
          while (this.ConList.length)
            this.ConList.removeAt(0);
          this.destroyDatatable();
          this.checkedAll = false;
          this.loading = this.LoadingEntities.loading;
        }),
      ).subscribe(o => {
        if (!o.length) {
          this.loading = this.LoadingEntities.noRecord;
          return;
        }
        o.forEach(x => {
          const fg = this.fb.group({ IS_CHECKED: false, ...x });
          this.ConList.push(fg);
        });

        this.reInitDatatable();
      }, () => this.loading = this.LoadingEntities.error);

    });

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

  onSubmit() {
    this.s_loader.showLoader()
    let f = this.formGroup.getRawValue();
    f = { ...f, conList: this.ConListIsSelect };

    this.s_clDeposit.Create(f)
      .pipe(finalize(() => this.s_loader.onEnd()))
      .subscribe(() => {
        toastr.success(message.created);
        this.route.navigate(['ris/receive-deposit-list']);
      }, () => toastr.error(message.failed));
  }

}
