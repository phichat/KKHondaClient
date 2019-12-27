import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContractCustomerService } from 'app/services/credit/contract-customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { setLocalDate, setZeroHours } from '../../../../app.config';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MStatusService, ZoneService, ContractGroupService, ContractTypeService } from 'app/services/masters';
import { LoaderService } from 'app/core/loader/loader.service';
import { UserService } from 'app/services/users';
import { DropDownModel } from 'app/models/drop-down-model';
import { message } from 'app/app.message';
import { ContractCustomerGroupModel, ContractCustomerDetailModel } from 'app/models/credit/contract-customer-model';

declare var toastr: any;

@Component({
  selector: 'app-customer-contract.component',
  templateUrl: 'customer-contract.component.html'
})

export class CustomerContractComponent implements OnInit {

  groupModel = new ContractCustomerGroupModel;
  detailModel: ContractCustomerDetailModel[];
  dataTable: any;
  formSearch: FormGroup;
  formHead: FormGroup;
  formDetail: FormGroup;
  formDetailArray: FormGroup;
  setLocalDate = setLocalDate;
  mode: string;
  code: string;

  contractNoDropdown: DropDownModel[];
  operatorDropdown: DropDownModel[];
  statusDropdown: DropDownModel[];

  constructor(
    private s_contract: ContractCustomerService,
    private chRef: ChangeDetectorRef,
    private s_loader: LoaderService,
    private s_user: UserService,
    private router: Router,
    private fb: FormBuilder,
    private s_mStatus: MStatusService,
    private s_zone: ZoneService,
    private s_contractGroup: ContractGroupService,
    private s_contractType: ContractTypeService,
    private _activatedRoute: ActivatedRoute,
  ) {
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }

    const user = this.s_user.cookies;

    this.formSearch = this.fb.group({
      contractId: new FormControl(''),
      contractDate: new FormControl(''),
      hireNo: new FormControl(''),
      hireName: new FormControl(''),
      status: new FormControl(''),
      guarantorNo1: new FormControl(''),
      guarantorName1: new FormControl(''),
      guarantorNo2: new FormControl(''),
      guarantorName2: new FormControl('')
    });

    this.formHead = this.fb.group({
      clId: new FormControl(0),
      contractId: new FormControl(''),
      communicateType: new FormControl(''),
      addressType: new FormControl(''),
      branchId: new FormControl(this.s_user.cookies.branchId),
    });

    this.formDetail = this.fb.group({
      cldId: new FormControl(0),
      contractId: new FormControl(''),
      cldDate: new FormControl(''),
      cldBookNo: new FormControl(''),
      cldReferNo: new FormControl(''),
      cldSubject: new FormControl(''),
      cldExpenses: new FormControl(''),
      cldComeback: new FormControl(''),
      cldPaymentDate: new FormControl(''),
      cldOperatorId: new FormControl(''),
      cldTurnover: new FormControl(''),
      cldCompletDate: new FormControl(''),
      cldStatus: new FormControl('อยู่ระหว่างดำเนินการ'),
    });

    this.formDetailArray = this.fb.group({
      detail: this.fb.array([])
    })

  }

  get tableArray(): FormArray {
    return this.formDetailArray.get('detail') as FormArray;
  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(async p => {
      this.mode = p.mode;
      this.code = p.code;

      this.formDetail.patchValue({
        cldOperatorId: this.s_user.cookies.id
      })

      if (this.mode == 'Edit') {
        this.formSearch.patchValue({
          contractId: this.code
        })
        this.onSelectContractNo()

        this.s_contract.GetCustomerContract(this.code).subscribe(x => {
          this.formHead.patchValue({
            clId: x.head.clId,
            contractId: x.head.contractId,
            communicateType: x.head.communicateType,
            addressType: x.head.addressType,
          })
          this.detailModel = x.detail;
        })
      }
    })

    this.s_contract.ContracNoDropdown(this.mode, this.code).subscribe(x => {
      this.contractNoDropdown = x
    })

    this.s_contract.OperatorDropdown().subscribe(x => {
      this.operatorDropdown = x
    })

    this.s_contract.StatusDropdown().subscribe(x => {
      this.statusDropdown = x
    })
  }

  onSelectContractNo() {
    const contractId = this.formSearch.value.contractId
    this.formHead.patchValue({
      contractId: contractId
    })
    for (let index = 0; index < this.tableArray.length; index++) {
      this.tableArray.at(index).patchValue({
        contractId: contractId
      })
    }

    this.s_contract.CreditContractDetail(contractId).subscribe(x => {
      this.formSearch.patchValue({
        contractDate: x.contractDate,
        hireNo: x.contractHirNo,
        hireName: x.contractHire,
        status: x.contractStatus,
        guarantorNo1: x.contractGurantorNo1,
        guarantorName1: x.contractGurantor1,
        guarantorNo2: x.contractGurantorNo2,
        guarantorName2: x.contractGurantor2
      })
    })
  }

  onSelectDetail(cldId: string) {
    this.s_contract.SelectDetail(cldId).subscribe(x => {
      this.formDetail.patchValue({
        cldId: x.cldId,
        contractId: x.contractId,
        cldDate: x.cldDate,
        cldBookNo: x.cldBookNo,
        cldReferNo: x.cldReferNo,
        cldSubject: x.cldSubject,
        cldExpenses: x.cldExpenses,
        cldStatus: x.cldStatus,
        cldComeback: x.cldComeback,
        cldPaymentDate: x.cldPaymentDate,
        cldOperatorId: x.cldOperatorId,
        cldTurnover: x.cldTurnover,
        cldCompletDate: x.cldCompletDate,
      })
    })
  }

  onComplet() {
    if(window.confirm('ยืนยันสถานะดำเนินการ')){
      this.formDetail.patchValue({
        cldStatus: "ดำเนินการเสร็จแล้ว",
      })
     }
  }

  onSave() {
    this.formDetail.value.cldDate = setZeroHours(this.formDetail.value.cldDate)
    this.formDetail.value.cldPaymentDate = setZeroHours(this.formDetail.value.cldPaymentDate)
    this.formDetail.value.cldCompletDate = setZeroHours(this.formDetail.value.cldCompletDate)
    this.formDetail.value.contractId = this.formHead.value.contractId

    this.groupModel.head = this.formHead.value
    this.groupModel.detail = this.formDetail.value
    this.s_contract.PostCustomerContract(this.groupModel).subscribe(x => {
      this.router.navigate(['credit/customer-contract'], { queryParams: { mode: 'Edit', code: x.contractId } });
      this.formDetail.reset()
      this.formDetail.patchValue({
        cldId: 0,
        cldStatus: "อยู่ระหว่างดำเนินการ",
        cldDate: new FormControl(null),
        cldPaymentDate: new FormControl(null),
        cldCompletDate: new FormControl(null),
      })
      this.ngOnInit()
      alert("บันทึกสำเร็จ")
    })
  }

  public initDatatable(): void {
    let table: any = $('table.set-dataTable')
    this.dataTable = table.DataTable({
      "scrollX": true
    })
  }

  public reInitDatatable(): void {
    this.destroyDatatable()
    setTimeout(() => this.initDatatable(), 0)
  }

  public destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }
  }

}