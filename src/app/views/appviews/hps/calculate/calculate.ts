import { CalculateConfig } from './calculate.config';
import { DropDownModel, DropdownTemplate } from 'app/models/drop-down-model';
import { IMAmpher } from 'app/interfaces/masters';
import { AmpherService } from 'app/services/masters';
import { tap, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { message } from 'app/app.message';
import { SaleService } from 'app/services/credit';
import { ChangeDetectorRef } from '@angular/core';
import { CustomerService } from 'app/services/customers';


export class Calculate extends CalculateConfig {

  constructor(
    public s_ampher: AmpherService,
    public s_calculate: SaleService,
    public s_customer: CustomerService,
    public chRef: ChangeDetectorRef
  ) {
    super();
  }

  selectItemEnging(e: any) {
    if (!e) {
      this.formCalculate.get('engineNo').reset();
      this.formCalculate.get('frameNo').reset();
      return;
    }
    this.formCalculate.patchValue({
      engineNo: e.engineNo,
      frameNo: e.frameNo
    });
  }

  selectItemProvince(e: DropDownModel) {
    this.ampherDropdown = this.s_ampher.GetAmpherByProvinceCode(e.value);
  }

  selectItemAmpher(e: IMAmpher) {
    if (!e) {
      this.formCalculate.get('ownerZipCode').reset()
      return;
    }
    this.formCalculate.patchValue({ ownerZipCode: e.zipcode });
  }

  selectItemContractOwner(e: DropDownModel) {
    if (!e) {
      this.formCalculate.get('contractOwner').reset();
      this.formCalculate.get('ownerAddress').reset();
      this.formCalculate.get('ownerProvinceCode').reset();
      this.formCalculate.get('ownerAmpherCode').reset();
      this.formCalculate.get('ownerZipCode').reset();
      return;
    }
    this.s_customer.getCustomerByCode(e.value).subscribe((x) => {
      this.formCalculate.patchValue({
        
        branchTax: x.idCard,
        branch: `${x.customerPrename}${x.customerName}`
      })
    })
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
}
