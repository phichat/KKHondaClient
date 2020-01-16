import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'app/services/selling';
import { SaleService } from 'app/services/credit';
import { UserService } from 'app/services/users';
import { tap, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { DropdownTemplate, DropDownModel } from 'app/models/drop-down-model';
import { ContractItemComponent } from '../contract-item/contract-item.component';
import { setLocalDate, setZeroHours } from 'app/app.config';
import { message } from 'app/app.message';
import { CustomerService } from 'app/services/customers';
import { LoaderService } from 'app/core/loader/loader.service';
import { AmpherService, ProvinceService } from 'app/services/masters';
import { BookingPaymentType } from 'app/entities/mcs.entities';
import { Calculate } from './calculate';

declare var toastr: any;

@Component({
  selector: 'app-credit',
  templateUrl: 'credit.component.html'
})

export class CreditComponent extends Calculate implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.s_booking.destroy();
  }
  constructor(
    private _activatedRoute: ActivatedRoute,
    private s_booking: BookingService,
    public s_calculate: SaleService,
    private s_user: UserService,
    public s_customer: CustomerService,
    private router: Router,
    private s_loader: LoaderService,
    public chRef: ChangeDetectorRef,
    public s_ampher: AmpherService,
    private s_province: ProvinceService
  ) {
    super(s_ampher, s_calculate, s_customer, chRef);
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    };

    this.userModel = this.s_user.cookies;
    this.provinceDropdown = this.s_province.DropDown();
  }

  @ViewChild(ContractItemComponent) contractItem;
  @ViewChild('tempDueDate') tempDueDate: ElementRef;
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
          sellTypeId: BookingPaymentType.Credit,
          sellAcitvityId: 2,
          saleBy: this.userModel.id
        });
      }
      this.searchEngine();
      this.searchcontractHire();
      this.searchcontractOwner();
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
      this.contractHireDropdown = [{ value: p.custCode, text: p.custFullName }];     
      this.s_customer.getCustomerByCode('CRM-01-0000746').subscribe(cus => {
        this.contractOwnerDropdown = [{ value: cus.customerCode, text: `${cus.customerPrename}${cus.customerName}` }];
        const add = cus.mCustomerAddress[0];
        this.ampherDropdown = this.s_ampher.GetAmpherByProvinceCode(add.provinceCode);
        this.formCalculate.patchValue({
          contractOwner: cus.customerCode,
          ownerAddress: add.address,
          ownerProvinceCode: add.provinceCode,
          ownerAmpherCode: add.amphorCode,
          ownerZipCode: add.zipcode,

          branchTax: cus.idCard,
          branch: `${cus.customerPrename}${cus.customerName}`
        });
      });

      // this.provinceDropdown.subscribe(p => {
      //   const pCode = p.find(o => o.text == province).value;
      //   this.ampherDropdown = this.s_ampher.GetAmpherByProvinceCode(pCode);
      //   this.ampherDropdown.subscribe(a => {
      //     const amp = a.find(o => o.amphorName == ampher);
      //     this.formCalculate.patchValue({
      //       ownerAddress: address,
      //       ownerAmpherCode: amp.amphorCode,
      //       ownerProvinceCode: pCode,
      //       ownerZipCode: amp.zipcode
      //     })
      //   })
      // });

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
      // this.model = p.creditCalculate;

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
    this.onChangeDepositPrice();
    this.instalmentCalculate();
  }

  instalmentCalculate() {

    const fg = this.formCalculate.value;

    const __instalmentEnd = parseInt((fg.instalmentEnd || 0 as any).toString());
    const __interest = fg.interest || 0;

    if (fg.instalmentEnd != undefined) {
      let firstPay = new Date(fg.firstPayment);
      firstPay.setDate(firstPay.getDate() + __instalmentEnd);
      this.tempDueDate.nativeElement.value = setLocalDate(firstPay.toISOString());
    }

    // จำนวนดอกเบี้ยที่ต้องชำระ
    fg.interestPrice = this.calInteratePriceByMonth(fg.netPrice, __interest, __instalmentEnd);

    // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระทั้งสิ้น 
    fg.remain = this.calRemain(fg.netPrice, fg.interestPrice);
    fg.totalRemain = fg.remain;

    // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระในแต่ละงวด
    fg.instalmentPrice = fg.remain;

    // จำนวนค่าภาษีมูลค่าเพิ่ม
    fg.vatPrice = this.calVatPrice(fg.instalmentPrice, fg.nowVat);

    // ค่าเช่าซื้อต่องวดก่อนรวมภาษี
    fg.instalmentPriceExtVat = this.instalmentPriceExtVat(fg.instalmentPrice, fg.vatPrice);

    // คำนวณ RATE
    fg.irr = this.calRate(__instalmentEnd, fg.instalmentPrice, fg.netPrice);

    // คำนวนอัตราดอกเบี้ยที่แท้จริงต่อปี
    fg.mrr = this.calMrr(fg.irr, __instalmentEnd);

    this.formCalculate.patchValue({ ...fg })
    this.s_calculate.changeData(fg);
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