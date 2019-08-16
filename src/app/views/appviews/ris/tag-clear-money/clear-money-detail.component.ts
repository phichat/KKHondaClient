import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { appConfig } from 'app/app.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize } from 'rxjs/operators';
import { ClearMoneyConfig } from './clear-money.config';
declare var toastr: any;

@Component({
    selector: 'app-clear-money-detail',
    templateUrl: './clear-money-detail.component.html'
})
export class ClearMoneyDetailComponent extends ClearMoneyConfig implements OnInit, OnDestroy {

    ngOnDestroy(): void {
        // this.destroyDatatable();
    }

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private s_user: UserService,
        private chRef: ChangeDetectorRef,
        private s_loader: LoaderService
    ) {
        super();
        toastr.options = {
            'closeButton': true,
            'progressBar': true,
        }
    }

    ngOnInit(): void {
    }

    onSubmit() {
        
    }
}