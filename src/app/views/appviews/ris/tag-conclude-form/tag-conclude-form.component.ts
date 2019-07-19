import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { UserService } from 'app/services/users';
import { ModelUser } from 'app/models/users';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-tag-conclude-form',
  templateUrl: './tag-conclude-form.component.html',
  styleUrls: ['./tag-conclude-form.component.scss']
})
export class TagConcludeFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private s_user: UserService
  ) { }
  checkedAll: boolean;
  mUser: BehaviorSubject<ModelUser>;
  createDate = new Date();
  total = 0;
  price2 = 0;

  get TagList(): FormArray {
    return this.formGroup.get('TagList') as FormArray;
  }

  public formGroup = this.fb.group({
    TagList: this.fb.array([])
  });

  ngOnInit() {
    const apiURL = `${appConfig.apiUrl}/Ris/CarRegisList`;
    this.http.get(apiURL).subscribe((x: any[]) => {
      const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false }], []);
      this.setItemFormArray(res, this.formGroup, 'TagList')

      this.TagList.valueChanges.subscribe((x: any[]) => {
        const price = x.filter(o => o.IS_CHECKED);
        this.total = price.reduce((a, c) => a += (c.price1 + c.price2), 0);
        this.price2 = price.reduce((a, c) => a += c.price2, 0);
      })
    });

    this.mUser = this.s_user.currentData;

  }

  checkAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.TagList.value.length; index++) {
      this.TagList.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }
}
