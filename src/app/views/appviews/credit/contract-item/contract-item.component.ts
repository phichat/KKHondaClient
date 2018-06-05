import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { CalculateModel, ContractItemModel } from '../../../../models/credit';
import { CalculateService } from '../../../../services/credit';
import { UserService } from '../../../../services/users';

declare var $: any;
declare var footable: any;

@Component({
    selector: 'app-contract-item',
    templateUrl: './contract-item.component.html',
    styleUrls: ['./contract-item.component.scss']
})
export class ContractItemComponent implements OnInit {

    // contractItemModel: ContractItemModel[];

    @Input() contractItemModel: ContractItemModel[];

    constructor(
        private chRef: ChangeDetectorRef,
        private _calService: CalculateService,
        private _userService: UserService
    ) {
    }

    ngOnInit() {

        if (this.contractItemModel.length === 0) {
            this._calService.currentData.subscribe(p => {

                // this.chRef.markForCheck();

                this.contractItemModel = new Array<ContractItemModel>()

                const instalmentEnd = p.instalmentEnd;
                const firstPay = new Date(p.firstPayment);
                const vat = p.nowVat;
                const itemNetPrice = p.instalmentPrice;
                const itemVatPrice = itemNetPrice * (vat / 100);
                const itemPrice = itemNetPrice - itemVatPrice;

                let j = 1;
                for (let i = 0; i < instalmentEnd; i++) {

                    // tslint:disable-next-line:prefer-const
                    let d: Date = (new Date);
                    const month = (firstPay.getMonth() + 1) + j;
                    d.setMonth(month);
                    d.setDate(p.dueDate);
                    const dueDate: Date = d;
                    // tslint:disable-next-line:prefer-const
                    let item = new ContractItemModel();

                    this._userService.currentData.subscribe(user => item.contractBranchId = user.branchId);
                    item.instalmentNo = j;
                    item.dueDate = dueDate;
                    item.vatRate = vat;
                    item.balance = itemPrice;
                    item.balanceVatPrice = itemVatPrice;
                    item.balanceNetPrice = itemNetPrice;
                    item.status = 0;
                    item.statusText = item.status === 0 ? 'ยังไม่ชำระ' : 'ชำระแล้ว';
                    item.interestInstalment = 0.00; // ดอกเบี้ย

                    this.contractItemModel.push(item)
                    j++;
                }

                this.chRef.detectChanges();

                const contract = $('table#contractItem');
                contract.footable();

            })
        }

    }

}
