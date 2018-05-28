import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { CalculateModel, ContractItemModel } from '../../../../models/credit';
import { CalculateService } from '../../../../services/credit';
import { UserService } from '../../../../services/users';

declare var $: any;
declare var footable: any;
declare var FooTable: any;

@Component({
    selector: 'app-contract-item',
    templateUrl: './contract-item.component.html',
    styleUrls: ['./contract-item.component.scss']
})
export class ContractItemComponent implements OnInit {

    // @Input() inputCalModel: CalculateModel;
    contractItemModel: ContractItemModel[];

    constructor(
        private chRef: ChangeDetectorRef,
        private _calService: CalculateService,
        private _userService: UserService
    ) {
    }

    ngOnInit() {
        this._calService.currentData.subscribe(p => {

            this.contractItemModel = new Array<ContractItemModel>()

            const instalmentEnd = p.instalmentEnd;
            const firstPay = new Date(p.firstPayment);
            const vat = p.nowVat;
            const itemNetPrice = p.instalmentPrice;
            const itemVatPrice = itemNetPrice * (vat / 100);
            const itemPrice = itemNetPrice - itemVatPrice;

            let j = 1;
            for (let i = 0; i < instalmentEnd; i++) {
                
                let d: Date = (new Date);
                const month = (firstPay.getMonth() + 1) + j;
                d.setMonth(month);
                d.setDate(p.dueDate);
                const dueDate: Date = d;
                let item = new ContractItemModel();
                
                item.contractItemId= null;
                item.contractId= null;
                this._userService.currentData.subscribe(user => item.contractBranchId = user.branchId);
                item.instalmentNo= j;
                item.dueDate= dueDate;
                item.vatRate= vat;
                item.balance= itemPrice;
                item.balanceVatPrice= itemVatPrice;
                item.balanceNetPrice= itemNetPrice;
                item.payPrice= null;
                item.payVatPrice= null;
                item.payNetPrice= null;
                item.discountRate= null;
                item.discountPrice= null;
                item.fineSum= null;
                item.distcountSum= null;
                item.taxInvoiceBranchId= null;
                item.taxInvoiceNo= null;
                item.netInvoice= null;
                item.status= 'ยังไม่ชำระ';
                item.interestInstalment= 0.00; // ดอกเบี้ย
                item.interestRemainAccount= null;
                item.GoodsPriceRemain= null;
                item.instalmentPrice= null;
                item.remain= null;
                item.remainVatPrice= null;
                item.remainNetPrice= null;
                item.delayDueDate= null;
                item.createDate= null;
                item.createBy= null;
                item.updateDate= null;
                item.updateBy = null;

                this.contractItemModel.push(item)
                j++;
            }

            this.chRef.detectChanges();

            const contract = $('table#contractItem');
            contract.footable();

        })
    }

}
