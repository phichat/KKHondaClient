import { Component, OnInit, EventEmitter, ChangeDetectorRef, Output, Input } from '@angular/core';
import { ModelCustomer } from '../../../../models/selling';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { PersonService } from '../../../../services/customers/person.service';

@Component({
  selector: 'app-modal-customer',
  templateUrl: './modal-customer.component.html',
  styleUrls: ['./modal-customer.component.scss']
})
export class ModalCustomerComponent implements OnInit {

  model = new ModelCustomer();
  personal = new Array<ModelCustomer>();
  selectedPersonCode: string;
  personalTypeahead = new EventEmitter<string>();

  @Output() customerEvent = new EventEmitter<ModelCustomer>();

  constructor(
    private _personService: PersonService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.serverSideSearch();
  }

  onSubmit() {
    this.customerEvent.emit(this.model);
  }

  serverSideSearch() {
    this.personalTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      switchMap(term => this._personService.filterByKey(term))
    ).subscribe(x => {
      this.cd.markForCheck();
      this.personal = x;
    }, (err) => {
      console.log(err);
      this.personal = [];
    });
  }

  onChangePersonal() {
    this.personal
      .filter(p => p.custCode === this.selectedPersonCode)
      .map(p => {
        this.model.idCard = p.idCard;
        this.model.custCode = p.custCode;
        this.model.custFullName = p.custFullName;
        this.model.custEmail = p.custEmail;
        this.model.custTel = p.custTel;
        this.model.custAddress = p.custAddress;
      })
  }
}
