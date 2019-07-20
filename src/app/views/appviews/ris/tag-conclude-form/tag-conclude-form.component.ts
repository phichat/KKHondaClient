import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { UserService } from 'app/services/users';
import { ModelUser } from 'app/models/users';
import { BehaviorSubject, Observable } from 'rxjs';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
declare var toastr: any;
@Component({
  selector: 'app-tag-conclude-form',
  templateUrl: './tag-conclude-form.component.html',
  styleUrls: ['./tag-conclude-form.component.scss']
})
export class TagConcludeFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private s_user: UserService,
    private chRef: ChangeDetectorRef,
    private router: Router,
  ) { 
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
  }
  }
  checkedAll: boolean;
  mUser: ModelUser;

  get TagList(): FormArray {
    return this.formGroup.get('TagList') as FormArray;
  }

  public formGroup = this.fb.group({
    createDate: new FormControl(new Date()),
    createBy: new FormControl(null),
    totalPrice: new FormControl(0),
    price1: new FormControl(0),
    price2: new FormControl(0),
    borrowMoney: new FormControl(0),
    TagList: this.fb.array([])
  });

  ngOnInit() {
    const apiURL = `${appConfig.apiUrl}/Ris/CarRegisList`;
    this.http.get(apiURL).subscribe((x: any[]) => {
      const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false }], []);
      this.setItemFormArray(res, this.formGroup, 'TagList')

      this.TagList.valueChanges.subscribe((x: any[]) => {
        const price = x.filter(o => o.IS_CHECKED);
        const totalPrice = price.reduce((a, c) => a += (c.price1 + c.price2), 0);
        const price1 = price.reduce((a, c) => a += c.price1, 0);
        const price2 = price.reduce((a, c) => a += c.price2, 0);
        this.formGroup.patchValue({
          totalPrice: totalPrice, 
          price1: price1,
          price2: price2
        })
      })
    });

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.mUser = x;
      this.formGroup.get('createBy').patchValue(x.id);
      this.chRef.detectChanges();
    });

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

  onSubmit() {
    let f = Object.assign({}, this.formGroup.value);
    f.TagList = this.TagList.value.filter(x => x.IS_CHECKED);
    console.log(f);
    toastr.success(message.created);
    setTimeout(() => {
      this.router.navigate(['ris/al-form']);
    }, 1000);
  }
}
