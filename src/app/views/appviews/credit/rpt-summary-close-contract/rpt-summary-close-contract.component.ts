import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RptSummayCloseContractService } from '../../../../services/credit';
import { DropDownModel } from '../../../../models/drop-down-model';
import { RptSumCloseContractModel } from '../../../../models/credit/rpt-sum-close-contract.model';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { appConfig, MyDatePickerOptions, getDateMyDatepicker, setZeroHours, setLocalDate } from '../../../../app.config';
// import { PageloaderService } from '../../pageloader/pageloader.component';

@Component({
    selector: 'app-rpt-summary-close-contract',
    templateUrl: './rpt-summary-close-contract.component.html'
})
export class RptSummaryCloseContractComponent implements OnInit {

    branchDropDown: DropDownModel[];
    prtSumCloseContract: RptSumCloseContractModel[];
    dataTable: any;

    myDatePickerOptions = MyDatePickerOptions;

    constructor(
        private rptSumCloseService: RptSummayCloseContractService,
        private chRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.rptSumCloseService.OnInit().subscribe(p => {
            if (p) {
                let dropdown = [];
                p.branch.map(item => {
                    dropdown.push({ value: item.branchId, text: item.branchName })
                })
                this.branchDropDown = dropdown;
            }
        })
        this.onDetectTable()

    }

    onSubmit(value: any) {
        const sdate = getDateMyDatepicker(value.endContractDateStart);
        const edate = getDateMyDatepicker(value.endContractDateEnd);
        
        value.endContractDateStart = setZeroHours(sdate);
        value.endContractDateEnd = setZeroHours(edate);

        this.rptSumCloseService.GetByCon(value).subscribe(p => {
            this.prtSumCloseContract = p;
            this.prtSumCloseContract.map(x => {
                x.contractDate = setLocalDate(x.contractDate);
                x.endDueDate = setLocalDate(x.endDueDate);
                x.endContractDate = setLocalDate(x.endContractDate);
            })
            this.onDetectTable()
        })
    }

    onPrint(value: any) {
        value.endContractDateStart = (new Date(value.endContractDateStart)).toISOString();
        value.endContractDateEnd = (new Date(value.endContractDateEnd)).toISOString();
        const branchId = `branchId=${value.branchId}`;
        const sDate = `endContractDateStart=${value.endContractDateStart}`;
        const eDate = `endContractDateEnd=${value.endContractDateEnd}`;
        window.open(`${appConfig.reportUrl}/Credits/index.aspx?rptSumEndContract=true&${branchId}&${sDate}&${eDate}`);
    }

    onDetectTable() {

        const table: any = $('table');

        if ($.fn.DataTable.isDataTable('table')) {
            this.dataTable = table.DataTable();
            this.dataTable.destroy();
        }

        this.chRef.detectChanges();

        this.dataTable = $('table').DataTable({
            'scrollX': true,
            'scrollY': true
        });

    }
}
