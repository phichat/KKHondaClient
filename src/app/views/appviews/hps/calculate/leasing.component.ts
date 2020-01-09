import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'app/services/selling';
import { SaleService } from 'app/services/credit';
import { UserService } from 'app/services/users';
import { CalculateConfig } from './calculate.config';
import { tap, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { DropdownTemplate, DropDownModel } from 'app/models/drop-down-model';
import { setZeroHours } from 'app/app.config';
import { ContractItemComponent } from '../contract-item/contract-item.component';
import { message } from 'app/app.message';
import { CustomerService } from 'app/services/customers';
import { LoaderService } from 'app/core/loader/loader.service';
import { ILeasing, ILeasingInterest } from 'app/interfaces/credit/lesing-linterface';
import { combineLatest } from 'rxjs';
import { ProvinceService, AmpherService } from 'app/services/masters';
import { IMAmpher } from 'app/interfaces/masters';
import { BookingPaymentType } from 'app/entities/mcs.entities';

declare var toastr: any;

@Component({
  selector: 'app-leasing',
  templateUrl: 'leasing.component.html'
})

export class LeasingComponent extends CalculateConfig implements OnInit {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private s_booking: BookingService,
    private s_calculate: SaleService,
    private s_user: UserService,
    private router: Router,
    private s_loader: LoaderService,
    private chRef: ChangeDetectorRef,
    private s_province: ProvinceService,
    private s_ampher: AmpherService,
    private s_customer: CustomerService
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    };

    this.userModel = this.s_user.cookies;
    this.provinceDropdown = this.s_province.DropDown();

    this.formCalculate.get('contractOwner').disable();
    this.formCalculate.get('ownerAddress').disable();
    this.formCalculate.get('ownerProvinceCode').disable();
    this.formCalculate.get('ownerAmpherCode').disable();
    this.formCalculate.get('ownerZipCode').disable();
  }

  @ViewChild(ContractItemComponent) contractItem;
  leasingList: ILeasing[];
  interestList: ILeasingInterest[];
  outStandingPriceState = 0;
  bookDepositState = 0;

  ngOnInit() {

    this._activatedRoute.queryParams.subscribe(p => {
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
          sellTypeId: BookingPaymentType.Leasing,
          sellAcitvityId: 25,
          saleBy: this.userModel.id
        });
      }
      this.searchEngine();
      this.searchcontractHire();
    });


  }

  selectItemLeasing = (e: ILeasing) => {
    if (!e) return;
    this.interestList = e.leasingIntList;
    this.contractOwnerDropdown = [{ value: e.leasingCode, text: e.leasingName }];
    this.s_customer.getCustomerByCode(e.leasingCode).subscribe(x => {
      const add = x.mCustomerAddress[0];
      this.ampherDropdown = this.s_ampher.GetAmpherByProvinceCode(add.provinceCode);
      this.formCalculate.patchValue({
        contractOwner: e.leasingCode,
        ownerAddress: add.address,
        ownerProvinceCode: add.provinceCode,
        ownerAmpherCode: add.amphorCode,
        ownerZipCode: add.zipcode,
      })
    });
    this.formCalculate.get('interest').reset();
    this.instalmentCalculate();
  };
  selectItemInterest = (e: ILeasingInterest) => {
    this.instalmentCalculate();
    if (!e) return;
    this.formCalculate.patchValue({
      fiId: e.fiId,
      fiintId: e.fiintId
    });
  }

  selectItemEnging(e: any) {
    if (!e) return;
    this.formCalculate.patchValue({
      engineNo: e ? e.engineNo : null,
      frameNo: e ? e.frameNo : null
    });
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
    const api1 = this.s_customer.GetLeasingByBranch(this.userModel.branchId.toString());
    const api2 = this.s_booking.getById(bookingId.toString());

    const observe = combineLatest(api1, api2).pipe(
      map(x => {
        return { leasing: x[0], booking: x[1] };
      })
    );
    observe.subscribe({
      next: (res) => {
        this.leasingList = res.leasing;
        const p = res.booking;
        this.outStandingPriceState = p.outStandingPrice;
        this.bookingNo = p.bookingNo;
        this.bookDepositState = p.deposit;
        this.contractHireDropdown = [{ value: p.custCode, text: p.custFullName }];
        this.formCalculate.patchValue({
          outStandingPrice: p.outStandingPrice,
          bookingPaymentType: p.bookingPaymentType,
          bookDeposit: p.deposit,
          nowVat: p.vat,
          contractHire: p.custCode
        });


        if (this.formCalculate.get('returnDeposit').value == '0') {
          this.formCalculate.patchValue({
            returnDepositPrice: p.deposit,
            depositPrice: p.deposit
          })
          this.onChangeDepositPrice();
        } else {
          this.formCalculate.patchValue({
            netPrice: (p.outStandingPrice + p.deposit).toFixed(2)
          });
        }

        this.instalmentCalculate();
        this.s_booking.changeData(p);
        this.s_loader.hideLoader();
      },
      error: () => {
        this.s_loader.hideLoader();
        toastr.error(message.error);
      }
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
      this.s_calculate.changeData(this.formCalculate.getRawValue());
    })
  }

  onChangeDeposit() {
    // เงินดาวน์ (บาท)
    // มูลค่าสินค้า * เงินดาวน์(%)
    const fg = this.formCalculate.getRawValue();
    const depositPrice = Math.ceil(fg.outStandingPrice * (fg.deposit / 100));
    const netPrice = (this.outStandingPriceState + this.bookDepositState) - depositPrice;
    this.formCalculate.patchValue({
      depositPrice,
      netPrice
    });
  }

  onChangeDepositPrice() {
    // เงินดาวน์ (%)
    // เงินดาวน์ * 100 / มูลค่าสินค้า
    const fg = this.formCalculate.getRawValue();
    const deposit = ((fg.depositPrice * 100) / fg.outStandingPrice).toFixed(2);
    const netPrice = (this.outStandingPriceState + this.bookDepositState) - fg.depositPrice;
    this.formCalculate.patchValue({
      deposit,
      netPrice
    });
  }

  onReturnDeposit() {
    const fg = this.formCalculate.getRawValue();
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
    this.onChangeDepositPrice();
    this.instalmentCalculate();
  }

  instalmentCalculate() {
    let fg = { ...this.formCalculate.getRawValue() };

    const __instalmentEnd = fg.instalmentEnd || 0;
    const __interest = fg.interest || 0;

    // จำนวนดอกเบี้ยที่ต้องชำระ
    if (fg.typePayment == '0') {
      // รูปแบบการชำระ รายงวด
      fg.interestPrice = this.calInteratePriceByMonth(fg.netPrice, __interest, __instalmentEnd);

    } else if (fg.typePayment == '1') {
      // รูปแบบการชำระ รายปี
      fg.interestPrice = this.calInteratePriceByYear(fg.netPrice, __interest, __instalmentEnd);
    }

    // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระทั้งสิ้น 
    fg.remain = this.calRemain(fg.netPrice, fg.interestPrice);

    // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระในแต่ละงวด
    const interestP = this.calInstalmentPrice(fg.remain, __instalmentEnd);
    fg.instalmentPrice = this.ceil10(interestP);

    // จำนวนค่าภาษีมูลค่าเพิ่ม
    fg.vatPrice = this.calVatPrice(fg.instalmentPrice, fg.nowVat);

    // ค่าเช่าซื้อต่องวดก่อนรวมภาษี
    fg.instalmentPriceExtVat = this.instalmentPriceExtVat(fg.instalmentPrice, fg.vatPrice);

    // คำนวณ RATE
    fg.irr = this.calRate(__instalmentEnd, fg.instalmentPrice, fg.netPrice);

    // คำนวนอัตราดอกเบี้ยที่แท้จริงต่อปี
    fg.mrr = this.calMrr(fg.irr, __instalmentEnd);

    fg = this.calCommission(fg);
    this.formCalculate.patchValue({ ...fg })
    this.s_calculate.changeData(fg);
  }

  calCommission(fg: any) {
    if (fg.fiCode && fg.fiintId) {

      let commission = this.interestList
        .filter(x => x.fiintId == fg.fiintId)
        .reduce((a, c) => [a, ...c.leasingComList], []);

      commission = commission
        .filter(x =>
          (fg.deposit >= x.minDown && fg.deposit <= x.maxDown) &&
          (fg.instalmentEnd >= x.minCtNo && fg.instalmentEnd <= x.maxCtNo)
        );

      if (commission.length) {
        fg.fiComId = commission[0].ficomId;
        fg.comPrice = commission[0].comPrice;
      } else {
        fg.fiComId = null;
        fg.comPrice = 0;
      }
    }
    return fg;
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
    let form = {
      calculate,
      contract,
      contractItem: this.contractItem.contractItemModel
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
        res => {
          const x = res.json();
          toastr.success(message.created);
          this.router.navigate(['credit/payment', x.contractId]);
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