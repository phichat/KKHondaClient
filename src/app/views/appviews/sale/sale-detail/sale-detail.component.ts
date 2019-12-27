import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from 'app/services/selling';
import { SaleService, ContractService } from 'app/services/credit';
import { UserService } from 'app/services/users';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'app/core/loader/loader.service';
import { message } from 'app/app.message';
import { CustomerService } from 'app/services/customers';
import { AmpherService, ProvinceService, ReasonService } from 'app/services/masters';
import { SaleDetailConfig } from './sale-detail.config';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private s_booking: BookingService,
    private s_sale: SaleService,
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

      api2.subscribe(x => {
        this.saleModel = x.sale;
        this.contractModel = x.creditContract;
        this.bookingModel = x.booking;
        this.s_booking.changeData(x.booking);
        this.SaleBy = this.s_user.GetUserDropdownById(x.sale.saleBy.toString());
        this.Owner = this.s_customer.getCustomerByCode(x.creditContract.contractOwner);
        this.OwnerAmphor = this.s_amphor.GetAmpherByCode(x.creditContract.ownerAmpherCode, x.creditContract.ownerProvinceCode);
        this.OwnerProvince = this.s_province.GetProvinceByCode(x.creditContract.ownerProvinceCode);
        this.reasonDropdown = this.s_reason.DropDown();
        if (x.sale.sellNo) {
          this.listSlip.push({
            slipNo: x.sale.sellNo,
            slipName: this.sellSlip.title,
            modalId: this.sellSlip.modalId,
            status: x.sale.sellStatus
          })
        }

        if (x.sale.returnDepositNo) {
          this.listSlip.push({
            slipNo: x.sale.returnDepositNo,
            slipName: this.reserveReturnSlip.title,
            modalId: this.reserveReturnSlip.modalId,
            status: x.sale.returnDepositStatus
          })
        }

        if (x.sale.receiptNo) {
          this.listSlip.push({
            slipNo: x.sale.receiptNo,
            slipName: this.receiptSlip.title,
            modalId: this.receiptSlip.modalId,
            status: x.sale.receiptStatus
          })
        }

        if (x.sale.invTaxRecNo) {
          this.listSlip.push({
            slipNo: x.sale.invTaxRecNo,
            slipName: this.invTaxRecSlip.title,
            modalId: this.invTaxRecSlip.modalId,
            status: x.sale.invTaxRecStatus
          })
        }

        if (x.sale.comNo) {
          this.listSlip.push({
            slipNo: x.sale.comNo,
            slipName: this.comSlip.title,
            modalId: this.comSlip.modalId,
            status: x.sale.comStatus
          })
        }

        this.s_loader.showLoader();

      }, () => {
        toastr.error(message.error);
        this.s_loader.hideLoader();
      })
    })
  }
}