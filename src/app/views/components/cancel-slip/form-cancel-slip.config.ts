
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUserResCookie } from 'app/interfaces/users';

export class FormCancelSlipConfig {
  
  user: IUserResCookie;
  cancelFormGroup = new FormGroup({
    slipNo: new FormControl(null, Validators.required),
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