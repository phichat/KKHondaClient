import { OnInit, Component, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { TahHistoryConfig } from './tag-history-car.config';
import { FormGroup, FormControl } from '@angular/forms';
import { distinctUntilChanged, tap, debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { CustomerService } from 'app/services/customers';
import { DropDownModel } from 'app/models/drop-down-model';
import { ICustomerOutput } from './customer-output.interface';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html'
})
export class OwnerComponent extends TahHistoryConfig implements OnInit {

  @Output() CustCode$ = new EventEmitter<ICustomerOutput>();
  @Input() $OwnerCode = new BehaviorSubject<string>(null);

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      typePersonal: new FormControl({ value: this.EntityType.Layman, disabled: true }),
      sex: new FormControl({ value: null, disabled: true }),
      code: new FormControl({ value: null }),
      fullName: new FormControl({ value: null, disabled: true }),
      nickName: new FormControl({ value: null, disabled: true }),
      idCard: new FormControl({ value: null, disabled: true }),
      phone: new FormControl({ value: null, disabled: true }),
      email: new FormControl({ value: null, disabled: true }),
      birthDay: new FormControl({ value: null, disabled: true }),
      address: new FormControl({ value: null, disabled: true })
    });
    this.$OwnerCode.subscribe(x => {
      if (!x) return;
      this.getCustomerByCode(x);
    })
    this.searchCust();
  }

  constructor(
    private s_cust: CustomerService,
    private chRef: ChangeDetectorRef
  ) {
    super();
  }

  selectItemCust(e: DropDownModel) {
    if (!e) {
      this.formGroup.reset();
      return
    };
    this.getCustomerByCode(e.value);
  }

  getCustomerByCode(code: string) {
    this.s_cust.getCustomerByCode(code).subscribe((x: any) => {
      const fullName = `${x.customerPrename}${x.customerName} ${x.customerSurname}`;
      this.CustCode$.emit({ code: code, fullName });
      this.formGroup.patchValue({
        typePersonal: x.typePersonal,
        sex: x.customerSex,
        code: x.customerCode,
        fullName: fullName,
        nickName: x.customerNickname,
        idCard: x.idCard,
        phone: x.customerPhone,
        email: x.customerEmail,
        birthDay: this.setLocalDate(x.birthday)
      });
    });
  }

  searchCust() {
    this.searchTypeahead.pipe(
      tap(() => {
        this.searchCustLoading = true;
        this.searchCustLoadingTxt = 'รอสักครู่...'
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => term ? this.s_cust.getByKey(term) : of([]))
    ).subscribe((x: DropDownModel[]) => {
      this.chRef.markForCheck();
      this.searchCustLoading = false;
      this.searchCustLoadingTxt = '';
      this.CustDropDown = x;
    }, () => {
      this.searchCustLoading = false;
      this.searchCustLoadingTxt = '';
      this.CustDropDown = [];
    });
  }
}