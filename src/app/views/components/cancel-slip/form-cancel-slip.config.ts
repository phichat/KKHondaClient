
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Input } from '@angular/core';
import { Observable } from 'rxjs';
import { DropDownModel } from 'app/models/drop-down-model';
import { IUserResCookie } from 'app/interfaces/users';

export class FormCancelSlipConfig {

  @Input() title: string = '';
  @Input() slipNo: string = '';
  @Input() reasonDropdown: Observable<DropDownModel[]>;
  
  user: IUserResCookie;
  cancelFormGroup = new FormGroup({
    slipNo: new FormControl({ value: '', disabled: true }, Validators.required),
    reason: new FormControl(null, Validators.required),
    approveId: new FormControl(null),
    confirm: new FormControl(false)
  });

  validCancelFormGroup = new FormGroup({
    gid: new FormControl(null, Validators.required),
    userName: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });
}