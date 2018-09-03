import { Component, OnInit } from '@angular/core';
import { ContractDetailModel } from '../../../../models/credit';
import { BookingModel } from '../../../../models/selling';
import { ContractService } from '../../../../services/credit';
import { ActivatedRoute, Router } from '@angular/router';
import { setLocalDate } from '../../../../app.config';
import { DropDownModel } from '../../../../models/drop-down-model';
import { BookingService } from 'app/services/selling';
import { UserService } from '../../../../services/users';
import { HttpErrorResponse } from '@angular/common/http';

declare var toastr: any;

@Component({
    selector: 'app-contract-canceled',
    templateUrl: './contract-canceled.component.html'
})
export class ContractCanceledComponent implements OnInit {

    contractDetailModel = new ContractDetailModel();
    bookingModel = new BookingModel();
    statusDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    userId: number;
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _credit: ContractService,
        private _bookingService: BookingService,
        private _userService: UserService,
        private router: Router
    ) {
        this._userService.currentData.subscribe(u => {
            this.userId = u.id
        });

        toastr.options = {
            'closeButton': true,
            'progressBar': true,
        }
    }

    ngOnInit() {
        this._activatedRoute.queryParams.subscribe(o => {
            if (o.contractId) {
                this._credit.Detail(o.contractId).subscribe(p => {
                    this.statusDropdown = p.statusDropdown.filter(i => i.value == '27' || i.value == '33');
                    p.creditContractDetail.contractDate = setLocalDate(p.creditContractDetail.contractDate);
                    this.contractDetailModel = p.creditContractDetail;
                    this.bookingModel = p.booking;
                    this._bookingService.changeData(p.booking);
                });
            }
        });

    }

    onSubmit(f: any) {
        if (confirm('ยืนยันการยกเลิกสัญญาเช่าซื้อหรือไม่ ?')) {
            this._credit.Termination(f).subscribe(p => {
                toastr.success('ยกเลิกสัญญาเช่าซื้อ สำเร็จ!');
                this.router.navigate(['credit/contract-list/active']);
            }, (err: HttpErrorResponse) => {
                toastr.error(err.statusText);
            })
        }
    }
}
