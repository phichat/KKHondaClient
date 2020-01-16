import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { BookingService } from 'app/services/selling';
import { SaleService, ContractService } from 'app/services/credit';
import { UserService } from 'app/services/users';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'app/core/loader/loader.service';
import { message } from 'app/app.message';
import { CustomerService } from 'app/services/customers';
import { AmpherService, ProvinceService, ReasonService } from 'app/services/masters';
import { SaleDetailConfig } from './sale-detail.config';
import { appConfig } from 'app/app.config';
import { DomSanitizer } from '@angular/platform-browser';
import { PaymentService } from 'app/services/credit/payment.service';
import { map, mapTo } from 'rxjs/operators';

declare var toastr: any;
@Component({
  selector: 'app-sale-detail',
  templateUrl: 'sale-detail.component.html',
  styleUrls: ['sale-detail.component.scss']
})

export class SaleDetailComponent extends SaleDetailConfig implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.s_booking.destroy();
  }

  url = "http://203.154.126.61/KK-Honda-Web/backoffice/php/_edit_gift_model.php?booking_id="

  constructor(
    private activatedRoute: ActivatedRoute,
    private s_booking: BookingService,
    private s_sale: SaleService,
    private s_payment: PaymentService,
    private s_contract: ContractService,
    private s_user: UserService,
    private s_loader: LoaderService,
    private s_customer: CustomerService,
    private s_amphor: AmpherService,
    private s_province: ProvinceService,
    private s_reason: ReasonService
  ) {
    super();
  }

  ngOnInit() {
    // Selling/Booking/GetById?bookingId
    this.activatedRoute.queryParams.subscribe(param => {
      this.s_loader.showLoader();
      const contractId = param['contractId'];
      // const bookingId = param['bookingId'];
      // const saleId = param['saleId'];

      const api2 = this.s_contract.getById(contractId);
      this.reasonList = this.s_reason.DropDown();
      api2.subscribe(x => {
        this.url = `${this.url}${x.booking.bookingId}`;
        this.saleModel = x.sale;
        this.contractModel = x.creditContract;
        this.bookingModel = x.booking;
        this.s_booking.changeData(x.booking);
        this.SaleBy = this.s_user.GetUserDropdownById(x.sale.saleBy.toString());
        this.Owner = this.s_customer.getCustomerByCode(x.creditContract.contractOwner);
        this.OwnerAmphor = this.s_amphor.GetAmpherByCode(x.creditContract.ownerAmpherCode, x.creditContract.ownerProvinceCode);
        this.OwnerProvince = this.s_province.GetProvinceByCode(x.creditContract.ownerProvinceCode);
        this.Hire = this.s_customer.getCustomerByCode(x.creditContract.contractHire);
        this.HireAmphor = this.s_amphor.GetAmpherByCode(x.creditContract.hireAmpherCode, x.creditContract.hireProvinceCode);
        this.HireProvince = this.s_province.GetProvinceByCode(x.creditContract.hireProvinceCode);
        

        if (x.sale.sellNo) {
          this.listSlip.push({
            slipNo: x.sale.sellNo,
            slipName: this.sellSlip.title,
            modalId: this.sellSlip.modalId,
            status: x.sale.sellStatus,
            printUrl: `${appConfig.apikkWeb}/php/print_sell.php?booking_id=${x.booking.bookingId}`
          })
        }

        if (x.sale.returnDepositNo) {
          this.listSlip.push({
            slipNo: x.sale.returnDepositNo,
            slipName: this.reserveReturnSlip.title,
            modalId: this.reserveReturnSlip.modalId,
            status: x.sale.returnDepositStatus,
            printUrl: `${appConfig.apikkWeb}/php/print_return_dep.php?booking_id=${x.booking.bookingId}`
          })
        }

        if (x.sale.invTaxRecNo) {
          const hirePurchase = x.booking.bookingPaymentType == this.BookingPaymentType.HierPurchase;
          this.listSlip.push({
            slipNo: x.sale.invTaxRecNo,
            slipName: hirePurchase ? this.invTaxSlip.title : this.invTaxRecSlip.title,
            modalId: hirePurchase ? this.invTaxSlip.modalId : this.invTaxRecSlip.modalId,
            status: x.sale.invTaxRecStatus,
            printUrl: hirePurchase
              ? `${appConfig.apikkWeb}/php/print_tax.php?booking_id=${x.booking.bookingId}`
              : `${appConfig.apikkWeb}/php/print_tax_2.php?booking_id=${x.booking.bookingId}`
          })
        }

        if (x.sale.comNo) {
          this.listSlip.push({
            slipNo: x.sale.comNo,
            slipName: this.comSlip.title,
            modalId: this.comSlip.modalId,
            status: x.sale.comStatus,
            printUrl: `${appConfig.apikkWeb}/php/print_promotion.php?booking_id=${x.booking.bookingId}`
          })
        }

        this.listReceiptAndTax.push({
          slipName: this.receiptSlip.title,
          modalId: this.receiptSlip.modalId
        })
        this.listReceiptAndTax.push({
          slipName: this.taxSlip.title,
          modalId: this.taxSlip.modalId
        })

        const receiptApi = this.s_payment.GetReceiptByContractId(x.creditContract.contractId)
        this.receiptSlipList = receiptApi.pipe(
          map(res => {
            return res.map(o => {
              return { slipNo: o.receiptNo, disabled: o.receiptStatus == true ? false : true };
            })
          })
        );
        this.taxInvSlipList = receiptApi.pipe(
          map(res => {
            return res.map(o => {
              return { slipNo: o.taxInvNo, disabled: o.taxInvStatus == true ? false : true };
            })
          })
        );

        this.s_loader.showLoader();

      }, () => {
        toastr.error(message.error);
        this.s_loader.hideLoader();
      })
    })
  }

  printSlip(url: string) {
    window.open(url)
  }
}


@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
} 