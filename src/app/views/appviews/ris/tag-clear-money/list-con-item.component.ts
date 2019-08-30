import { OnInit, Component } from '@angular/core';
import { ListConItemConfig } from './list-con-item.config';
import { HttpClient } from '@angular/common/http';
import { mergeMap, tap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { IConRes } from 'app/interfaces/ris';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-con-item-component',
  templateUrl: './list-con-item.component.html'
})
export class ListConItemComponent extends ListConItemConfig implements OnInit {

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    super();
    this.formGroup = this.fb.group({
      ConList: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.$SedItem.pipe(
      tap(() => {
        this.loading = this.LoadEnt.loading;
        while (this.ConList.length) this.ConList.removeAt(0);
      }),
      mergeMap(x => {
        if (x == null) return of([]);
        const params = { conListNo: x.conList };
        return this.http.get<IConRes[]>(`${this.risUrl}/GetByConNoList`, { params })
          .pipe(
            map(o => o.reduce((a, c) => [...a, { ...c, sedNo: x.sedNo }], []))
          );
      })
    ).subscribe((x: IConRes[]) => {
      if (!x.length) { 
        this.loading = this.LoadEnt.noRecord; 
        this.$ConNoOutPut.next(null);
        return; 
      }
      this.setItemFormArray(x, this.formGroup, 'ConList');
    }, () => this.loading = this.LoadEnt.error);

    this.$ConItemOutput.subscribe(x => {
      if (x == null || this.ConList.length == 0) return;
      const conList = this.ConList.value as IConRes[];
      const i = conList.findIndex(o => o.bookingNo == x.conNo);
      this.ConList.at(i).patchValue({
        state1: x.state1,
        state2: x.state2,
        cutBalance: x.cutBalance
      });
    })
  }

  selectCon(conNo: string) {
    this.$ConNoOutPut.next(conNo);
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }
}

