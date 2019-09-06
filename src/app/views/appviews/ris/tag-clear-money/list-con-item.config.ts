import { BehaviorSubject } from 'rxjs';
import { Input, Output, EventEmitter } from '@angular/core';
import { RisConfig } from '../ris.config';
import { ISedRes, IConRes, IConItemOutput } from 'app/interfaces/ris';
import { FormGroup, FormArray } from '@angular/forms';
import * as $ from 'jquery';

export class ListConItemConfig extends RisConfig {
  @Input() $SedItem: BehaviorSubject<ISedRes>;
  @Input() $ConItemInput: BehaviorSubject<IConItemOutput>;
  @Output() ConNoOutPut$ = new BehaviorSubject<string>(null);
  @Output() ConResOutput$ = new EventEmitter<IConRes[]>();
  // public ConList: IConRes[] = [];
  public dataTable: any;
  public loading: number;
  public formGroup: FormGroup;
  get ConList(): FormArray {
    return this.formGroup.get('ConList') as FormArray;
  }

  public initDatatable(): void {
    let table: any = $('#listConItem');
    this.dataTable = table.DataTable({
      scrollX: true,
    });
  }

  public reInitDatatable(): void {
    this.destroyDatatable()
    setTimeout(() => this.initDatatable(), 0);
  }

  public destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }
  }
}
