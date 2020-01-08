import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CalculateConfig } from './calculate.config';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'app/services/selling';
import { SaleService } from 'app/services/credit';
import { UserService } from 'app/services/users';
import { tap, distinctUntilChanged, debounceTime, switchMap, finalize, map, mergeMap, mapTo } from 'rxjs/operators';
import { DropdownTemplate, DropDownModel } from 'app/models/drop-down-model';
import { ContractItemComponent } from '../contract-item/contract-item.component';
import { setLocalDate, setZeroHours } from 'app/app.config';
import { message } from 'app/app.message';
import { CustomerService } from 'app/services/customers';
import { LoaderService } from 'app/core/loader/loader.service';
import { PaymentTypeList, PaymentType } from 'app/entities/general.entities';
import { IPayment } from 'app/interfaces/payment.interface';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ProvinceService, AmpherService } from 'app/services/masters';
import { IMAmpher } from 'app/interfaces/masters';
import { ContractItemModel } from 'app/models/credit';
import { BookingPaymentType } from 'app/entities/mcs.entities';

declare var toastr: any;

@Component({
  selector: 'app-cash',
  templateUrl: 'cash.component.html'
})

export class CashComponent extends CalculateConfig implements OnInit {
  constructor(
    private router: Router,
    private chRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private s_booking: BookingService,
    private s_calculate: SaleService,
    private s_user: UserService,
    private s_customer: CustomerService,
    private s_loader: LoaderService,
    private s_province: ProvinceService,
    private s_ampher: AmpherService
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    };

    this.userModel = this.s_user.cookies;
    this.provinceDropdown = this.s_province.DropDown();

  }
  private paymentData: IPayment = {
    paymentPrice: null,
    accBankId: null,
    paymentDate: new Date(),
    options: {
      invalid: true,
      disabled: false
    }
  };

  PaymentData = new BehaviorSubject(null);
  formPayment: IPayment;
  PaymentTypeList = PaymentTypeList;
  PaymentType = PaymentType;
  outStandingPriceState = 0;
  bookDepositState = 0;

  ngOnInit() {

    this._activatedRoute.queryParams.subscribe(async p => {
      this.mode = p.mode;

      if (p.mode === 'edit' && p.calculateId) {
        this.onLoadCaculateData(p.calculateId);

      } else if (p.mode === 'revice' && p.calculateId) {
        this.onLoadCaculateData(p.calculateId);

      } else if (p.mode === 'create' && p.bookingId) {

        this.onLoadBooking(p.bookingId);

        this.contractModel.bookingId = p.bookingId;
        this.contractModel.contractStatus = 31; // อยู่ระหว่างการผ่อนชำระ
        this.contractModel.branchId = this.userModel.branch;
        this.contractModel.createBy = this.userModel.id;

        this.formCalculate.patchValue({
          bookingId: p.bookingId,
          sellTypeId: BookingPaymentType.Cash,
          sellAcitvityId: 2,
          saleBy: this.userModel.id
        });
      }

      this.searchEngine();
      this.searchcontractHire();
      this.searchcontractOwner();

      this.formPayment = this.paymentData;
      this.PaymentData.next(this.paymentData);
    });

  }

  selectItemEnging(e: any) {
    this.formCalculate.patchValue({
      engineNo: e ? e.engineNo : null,
      frameNo: e ? e.frameNo : null
    });
  }

  selectItemProvince(e: DropDownModel) {
    this.ampherDropdown = this.s_ampher.GetAmpherByProvinceCode(e.value);
  }

  selectItemAmpher(e: IMAmpher) {
    this.formCalculate.patchValue({ ownerZipCode: e.zipcode });
  }

  searchEngine() {
    this.engineTypeahead.pipe(
      tap(() => {
        this.searchEngineLoading = true;
        this.dropdownLoadingTxt = message.loading;
      }),
      distinctUntilChanged(),
      debounceTime(100),
      switchMap(term => {
        const bookingId = this.formCalculate.get('bookingId').value;
        const branch = this.userModel.branch.toString();
        return this.s_calculate.GetEngineByKeyword(bookingId, branch, term);
      })
    ).subscribe(x => {
      this.chRef.markForCheck();
      this.engineUnload();
      this.engineDropdown = x;
      this.engineDropdown.map(item => {
        item.text = `หมายเลขเครื่อง: ${item.engineNo}, หมายเลขตัวถัง: ${item.frameNo}`;
        item.value = item.logId.toString();
      })
    }, () => {
      this.engineUnload();
      this.engineDropdown = new Array<DropdownTemplate>();
    });
  }

  searchcontractOwner() {
    this.contractOwnerTypeahead.pipe(
      tap(() => {
        this.contractOwnerLoading = true;
        this.dropdownLoadingTxt = message.loading;
      }),
      distinctUntilChanged(),
      debounceTime(300),
      switchMap(term => this.s_customer.getByKey(term))
    ).subscribe(x => {
      this.chRef.markForCheck();
      this.contractOwnerDropdown = x;
      this.contractOwnerUnload();
    }, () => {
      this.contractOwnerUnload();
      this.contractOwnerDropdown = new Array<DropDownModel>();
    });
  }

  searchcontractHire() {
    this.contractHireTypeahead.pipe(
      tap(() => {
        this.contractHireLoading = true;
        this.dropdownLoadingTxt = message.loading;
      }),
      distinctUntilChanged(),
      debounceTime(300),
      switchMap(term => this.s_customer.getByKey(term))
    ).subscribe(x => {
      this.chRef.markForCheck();
      this.contractHireDropdown = x;
      this.contractHireUnload();
    }, () => {
      this.contractHireUnload();
      this.contractHireDropdown = new Array<DropDownModel>();
    });
  }

  onLoadBooking(bookingId: number) {
    this.s_loader.showLoader();
    this.s_booking.getById(bookingId.toString()).subscribe(p => {
      this.outStandingPriceState = p.outStandingPrice;
      this.bookingNo = p.bookingNo;
      this.bookDepositState = p.deposit;

      const province = this.findProvince(p.address);
      const ampher = this.findAmpher(p.address);
      const address = this.findAddress(p.address);
      this.contractHireDropdown = [{ value: p.custCode, text: p.custFullName }]
      this.contractOwnerDropdown = [{ value: p.custCode, text: p.custFullName }]

      this.provinceDropdown.subscribe(p => {
        const pCode = p.find(o => o.text == province).value;
        this.ampherDropdown = this.s_ampher.GetAmpherByProvinceCode(pCode);
        this.ampherDropdown.subscribe(a => {
          const amp = a.find(o => o.amphorName == ampher);
          this.formCalculate.patchValue({
            ownerAddress: address,
            ownerAmpherCode: amp.amphorCode,
            ownerProvinceCode: pCode,
            ownerZipCode: amp.zipcode
          })
        })
      });

      this.formCalculate.patchValue({
        outStandingPrice: p.outStandingPrice,
        bookingPaymentType: p.bookingPaymentType,
        bookDeposit: p.deposit,
        nowVat: p.vat,
        contractHire: p.custCode,
        contractOwner: p.custCode
      })

      if (this.formCalculate.get('returnDeposit').value == '0') {
        this.formCalculate.patchValue({
          returnDepositPrice: p.deposit,
          depositPrice: p.deposit
        })
      } else {
        this.formCalculate.patchValue({
          netPrice: (p.outStandingPrice + p.deposit).toFixed(2)
        });
      }

      this.instalmentCalculate();
      this.s_booking.changeData(p);
      this.s_loader.hideLoader();
    },
      () => {
        this.s_loader.hideLoader();
        toastr.error(message.error);
      });
  }

  onLoadCaculateData(calculateId: number) {
    this.s_calculate.GetById(calculateId.toString()).subscribe(p => {

      this.contractModel = p.creditContract;
      this.contractItemModel = p.creditContractItem;
      this.bookingNo = p.booking.bookingNo;

      this.formCalculate.patchValue({
        firstPayment: new Date(p.creditCalculate.firstPayment)
      });

      this.s_booking.changeData(p.booking);
    })
  }

  onReturnDeposit() {
    const fg = this.formCalculate.value;
    const depositPrice = fg.depositPrice;
    // คืนเงินมัดจำ
    switch (fg.returnDeposit) {
      case '1':
        // ถ้าคืนเงิน
        // หักเงินจองออกจากเงินดาวน์
        if (depositPrice >= 0 && depositPrice >= this.bookDepositState) {
          fg.depositPrice = depositPrice - this.bookDepositState;
        };
        break;

      case '0':
        // ถ้าใช้เป็นเงินดาวน์
        // รีเซ็ต ราคาสินค้า
        fg.outStandingPrice = this.outStandingPriceState;
        // เพิ่มเงินจองเข้าไปในเงินดาวน์
        fg.depositPrice = depositPrice + this.bookDepositState;
        break;
    }
    this.formCalculate.patchValue({ ...fg });
    this.instalmentCalculate();
  }

  instalmentCalculate() {

    const fg = this.formCalculate.value;

    const __instalmentEnd = parseInt((fg.instalmentEnd || 0 as any).toString());
    const __interest = fg.interest || 0;

    // จำนวนดอกเบี้ยที่ต้องชำระ
    fg.interestPrice = this.calInteratePriceByMonth(fg.netPrice, __interest, __instalmentEnd);

    // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระทั้งสิ้น 
    fg.remain = this.calRemain(fg.netPrice, fg.interestPrice);

    // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระในแต่ละงวด
    const interestP = this.calInstalmentPrice(fg.remain, __instalmentEnd);
    fg.instalmentPrice = this.ceil10(interestP) || 0;

    // จำนวนค่าภาษีมูลค่าเพิ่ม
    fg.vatPrice = this.calVatPrice(fg.instalmentPrice, fg.nowVat);

    // ค่าเช่าซื้อต่องวดก่อนรวมภาษี
    fg.instalmentPriceExtVat = this.instalmentPriceExtVat(fg.instalmentPrice, fg.vatPrice) || 0;

    // คำนวณ RATE
    fg.irr = this.calRate(__instalmentEnd, fg.instalmentPrice, fg.netPrice);

    // คำนวนอัตราดอกเบี้ยที่แท้จริงต่อปี
    fg.mrr = this.calMrr(fg.irr, __instalmentEnd);

    this.formCalculate.patchValue({ ...fg })
    this.s_calculate.changeData(fg);

    this.paymentData = { ...this.paymentData, paymentPrice: fg.netPrice };
    this.PaymentData.next(this.paymentData);
  }

  formPaymentChange(event: IPayment) {
    this.formPayment = event;
    this.formCalculate.patchValue({
      paymentPrice: event.paymentPrice,
      discountPrice: event.discountPrice,
      totalPaymentPrice: event.paymentPrice,
      accBankId: event.accBankId || null,
      paymentDate: event.paymentDate,
      documentRef: event.documentRef
    });
  }

  onSubmit() {
    let calculate = { ...this.formCalculate.getRawValue() };
    calculate.firstPayment = setZeroHours(calculate.firstPayment);
    const contract = {
      ...this.contractModel,
      contractHire: calculate.contractHire,
      contractOwner: calculate.contractOwner,
      ownerAddress: calculate.ownerAddress,
      ownerProvinceCode: calculate.ownerProvinceCode,
      ownerAmpherCode: calculate.ownerAmpherCode,
      ownerZipCode: calculate.ownerZipCode
    }

    let item = new ContractItemModel();
    const vatUp = 1 + (calculate.nowVat / 100);
    // ค่างวดถอด vat
    const instalmentExcVat = (calculate.instalmentPrice / vatUp);
    const balance = instalmentExcVat;
    const balanceVatPrice = calculate.instalmentPrice - balance;
    const balanceNetPrice = calculate.instalmentPrice;
    item.contractBranchId = this.userModel.branchId;
    item.status = 11; // ชำระครบ
    item.instalmentNo = 0;
    item.dueDate = calculate.firstPayment;
    item.vatRate = calculate.nowVat;
    item.balance = (balance);
    item.balanceVatPrice = balanceVatPrice;
    item.balanceNetPrice = (balanceNetPrice);
    item.remain = 0;
    item.remainVatPrice = 0;
    item.remainNetPrice = 0;
    item.initialPrice = 0;
    item.principal = 0;
    item.interestInstalment = 0;
    item.principalRemain = 0;
    item.updateBy = this.userModel.id;

    let form = {
      calculate,
      contract,
      contractItem: [item]
    };

    if (this.mode === 'create') {
      this.onCreate(form);

    } else if (this.mode === 'edit') {
      this.onEdit(form);

    } else if (this.mode === 'revice') {
      this.onRevice(form);
    }
  }

  onCreate(obj: any) {
    this.s_calculate
      .Create(obj.calculate, obj.contract, obj.contractItem)
      .subscribe(
        () => {
          toastr.success(message.created);
          this.router.navigate(['credit/contract-list/active']);
        },
        () => {
          toastr.error(message.error);
        }
      );
  }

  onEdit(obj: any) {
    this.s_calculate
      .Edit(obj.calculate, obj.contract, obj.contractItem)
      .subscribe(
        () => {
          this.router.navigate(['credit/contract-list/active']);
        },
        () => {
          toastr.error(message.error);
        }
      );
  }

  onRevice(obj: any) {
    this.s_calculate
      .Revice(obj.calculate, obj.contract, obj.contractItem)
      .subscribe(
        () => {
          this.router.navigate(['credit/contract-list/active']);
        },
        () => {
          toastr.error(message.error);
        }
      );
  }

}