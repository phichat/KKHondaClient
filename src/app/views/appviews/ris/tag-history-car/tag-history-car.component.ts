import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TahHistoryConfig } from './tag-history-car.config';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICustomerOutput } from './customer-output.interface';
import { DropDownModel } from 'app/models/drop-down-model';
import { tap, debounceTime, distinctUntilChanged, switchMap, mergeMap, map, finalize } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { CarHistoryService, CarRegisService } from 'app/services/ris';
import { ICarHistory } from 'app/interfaces/ris';
import { LoaderService } from 'app/core/loader/loader.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ProvinceService } from 'app/services/masters';
import { BookingService } from 'app/services/selling';

@Component({
  selector: 'app-tag-history-car',
  templateUrl: './tag-history-car.component.html',
  styleUrls: ['./tag-history-car.component.scss']
})
export class TagHistoryCarComponent extends TahHistoryConfig implements OnInit {

  constructor(
    private chRef: ChangeDetectorRef,
    private s_loader: LoaderService,
    private s_carHist: CarHistoryService,
    private s_province: ProvinceService,
    private s_booking: BookingService,
    private s_carRegis: CarRegisService
  ) {
    super();
  }

  conId: number;
  visitorCode = new BehaviorSubject<string>(null);
  ownerCode = new BehaviorSubject<string>(null);

  ngOnInit() {
    this.formGroup = new FormGroup({
      tagNo: new FormControl(null),
      province: new FormControl(null),
      typeName: new FormControl(null),
      brandName: new FormControl(null),
      modelName: new FormControl(null),
      colorName: new FormControl(null),
      fNo: new FormControl(null, Validators.required),
      eNo: new FormControl(null, Validators.required),
      tagRegis: new FormControl({ value: null, disabled: true }),
      tagExpire: new FormControl({ value: null, disabled: true }),
      prbNo: new FormControl({ value: null, disabled: true }),
      prbCompany: new FormControl({ value: null, disabled: true }),
      prbRegis: new FormControl({ value: null, disabled: true }),
      prbExpire: new FormControl({ value: null, disabled: true }),
      commitNo: new FormControl({ value: null, disabled: true }),
      commitExpire: new FormControl({ value: null, disabled: true }),
      warNo: new FormControl({ value: null, disabled: true }),
      warCompany: new FormControl({ value: null, disabled: true }),
      warRegis: new FormControl({ value: null, disabled: true }),
      warExpire: new FormControl({ value: null, disabled: true }),
      ownerCode: new FormControl(null, Validators.required),
      ownerName: new FormControl(null, Validators.required),
      visitorCode: new FormControl(null, Validators.required),
      visitorName: new FormControl(null, Validators.required)
    });

    this.HistoryCar$.emit({ invalid: true });

    this.formGroup.valueChanges.subscribe(() => {
      if (this.formGroup.valid) {
        this.HistoryCar$.emit({ ...this.formGroup.getRawValue(), invalid: false });
      } else {
        this.HistoryCar$.emit({ invalid: true });
      }
    });

    this.loadCarHistory();

    this.searchEngine();

  }

  loadCarHistory() {
    const province = this.s_province.DropDown();

    if (this.$Motobike) {

      this.$Motobike.subscribe(x => {
        this.chRef.markForCheck();
        if (x) {
          this.formGroup.patchValue({
            ...x,
            eNo: x.engineNo,
            fNo: x.frameNo
          });
          this.ownerCode.next(x.ownerCode);
        };

        province.pipe(
          tap(() => this.s_loader.show()),
          finalize(() => this.s_loader.hideLoader())
        ).subscribe(o => this.provinceDropdown = o);

      });
    }

    if (this.$ConId) {
      this.$ConId.pipe(
        tap(() => this.s_loader.show()),
        mergeMap(x => {
          this.conId = x;
          const observe = combineLatest(this.s_carHist.GetByBookingId(x.toString()), province)
          return observe;
        }),
        map((x) => { return { history: x[0], province: x[1] } })
      ).subscribe(x => {
        this.chRef.markForCheck();
        this.visitorCode.next(x.history.visitorCode);
        this.ownerCode.next(x.history.ownerCode);
        this.provinceDropdown = x.province;
        this.patchValueForm(x.history);
        this.s_loader.hideLoader()
      }, () => this.s_loader.hideLoader());
    }

  }

  ownerChange(event: ICustomerOutput) {
    this.formGroup.patchValue({
      ownerCode: event.code,
      ownerName: event.fullName
    })
  }

  visitorChange(event: ICustomerOutput) {
    this.formGroup.patchValue({
      visitorCode: event.code,
      visitorName: event.fullName
    })
  }

  patchValueForm(event: ICarHistory | any) {
    if (!event) {
      this.formGroup.reset();
      // this.$BookingId.next(0);
      return;
    }
    // if (event.bookingId != this.conId) {
    //   // this.$BookingId.next(event.bookingId);
    // };
    this.formGroup.patchValue({
      ...event,
      tagRegis: this.setLocalDate(event.tagRegis),
      tagExpire: this.setLocalDate(event.tagExpire),
      prbRegis: this.setLocalDate(event.prbRegis),
      prbExpire: this.setLocalDate(event.prbExpire),
      warRegis: this.setLocalDate(event.warRegis),
      warExpire: this.setLocalDate(event.warExpire)
    })
  }

  searchEngine() {
    this.searchTypeahead.pipe(
      tap(() => {
        this.searchEngineLoading = true;
        this.searchEngineLoadingTxt = 'รอสักครู่...'
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => term ? this.s_carHist.SearchByEngine(term) : of([]))
    ).subscribe((x: DropDownModel[]) => {
      this.chRef.markForCheck();
      this.searchEngineLoading = false;
      this.searchEngineLoadingTxt = '';
      this.EngineDropDown = x;
      this.EngineDropDown.map(item => {
        item.text = `${item.eNo} ${item.fNo}`;
        item.value = `${item.eNo} ${item.fNo}`;
      })
    }, () => {
      this.searchEngineLoading = false;
      this.searchEngineLoadingTxt = '';
      this.EngineDropDown = [];
    });
  }
}
