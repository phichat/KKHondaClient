import { OnInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl } from '@angular/forms';
import { ListItemConfig } from './list-item.config';
import { finalize } from 'rxjs/operators';
import { message } from 'app/app.message';
import { getDateMyDatepicker } from 'app/app.config';

@Component({
    selector: 'app-list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./tag-con-form.component.scss']
})
export class ListItemComponent extends ListItemConfig implements OnInit {

    constructor(
        private http: HttpClient,
        private fb: FormBuilder
    ) {
        super()
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            carRegisListItem: this.fb.array([])
        });

        this.formCarHistory = this.fb.group({
            carNo: new FormControl(null),
            bookingId: new FormControl(null),
            eNo: new FormControl(null),
            fNo: new FormControl(null),
            tagNo: new FormControl(null),
            branchId: new FormControl(null),
            tagRegis: new FormControl({ myDate: null }),
            tagExpire: new FormControl({ myDate: null }),
            prbNo: new FormControl(null),
            prbCompany: new FormControl(null),
            prbRegis: new FormControl({ myDate: null }),
            prbExpire: new FormControl({ myDate: null }),
            commitNo: new FormControl(null),
            commitExpire: new FormControl({ myDate: null }),
            warNo: new FormControl(null),
            warCompany: new FormControl(null),
            warRegis: new FormControl({ myDate: null }),
            warExpire: new FormControl({ myDate: null })
        })

        this.formExpenses = this.fb.group({
            expitemId: new FormControl(null),
            expItem: new FormControl(null),
            expPrice1: new FormControl(0),
            expPrice2: new FormControl(0),
            expVatPrice1: new FormControl(0),
            expIsVat: new FormControl(false),
            otItem: new FormControl(null),
            otPrice1: new FormControl(0),
            otPrice2: new FormControl(0),
            otVatPrice1: new FormControl(0),
            otIsVat: new FormControl(false)
        })

        this.formExpenses.get('expPrice2')
            .valueChanges
            .subscribe(() => {
                this.onExpensesCalVat();
            });

        this.formExpenses.get('otPrice2')
            .valueChanges
            .subscribe(() => {
                this.onOtherCalVat();
            });

        const apiURL = `${this.apiURL}/ExpensesOther`;
        this.http.get(apiURL)
            .pipe(
                finalize(() => this.loading = 1),
            ).subscribe((x: any[]) => {
                this.expenses = x;
                this.Car.subscribe(o => {
                    if (!o) return;
                    if (o.freeTag == 1) {
                        const item = this.expenses.find(x => x.expensesID == 33);
                        this.addFreeItem(item);
                    }
                    if (o.freeAct == 1) {
                        const item = this.expenses.find(x => x.expensesID == 40);
                        this.addFreeItem(item);
                    }
                    if (o.freeWarranty == 1) {
                        const item = this.expenses.find(x => x.expensesID == 39);
                        this.addFreeItem(item);
                    }
                });
            }, () => this.loading = 2);

        this.CarRegisListItem
            .valueChanges
            .subscribe((x: any[]) => this.emitValue(x));

        this.formCarHistory
            .valueChanges
            .subscribe(x => this.emitValueTagHistory(x));
    }

    addFreeItem(item: any) {
        const fg = this.fb.group({
            itemId: item.expensesID,
            itemName: item.expensesDescription,
            itemPrice1: item.expensesAmount,
            itemPrice2: 0,
            itemIsVat: false,
            itemVatPrice1: 0
        });
        this.CarRegisListItem.push(fg);
    }

    onAddExpItem() {
        const exp = this.formExpenses.value;
        const fg = this.fb.group({
            itemId: exp.expitemId,
            itemName: exp.expItem,
            itemPrice1: exp.expPrice1,
            itemPrice2: exp.expPrice2,
            itemIsVat: exp.expIsVat,
            itemVatPrice1: exp.expVatPrice1
        })
        this.CarRegisListItem.push(fg);
        this.formExpenses.patchValue({
            expitemId: null,
            expItem: null,
            expPrice1: 0,
            expPrice2: 0,
            expIsVat: false,
            expVatPrice1: 0
        })
    }

    onAddOtItem() {
        const exp = this.formExpenses.value;
        const fg = this.fb.group({
            itemName: exp.otItem,
            itemPrice1: exp.otPrice1,
            itemPrice2: exp.otPrice2,
            itemIsVat: exp.otIsVat,
            itemVatPrice1: exp.otVatPrice1
        })
        this.CarRegisListItem.push(fg);
        this.formExpenses.patchValue({
            otItem: null,
            otPrice1: 0,
            otPrice2: 0,
            otIsVat: false,
            otVatPrice1: 0
        })
    }

    onSelectExpenses(item: any) {
        this.formExpenses.get('expPrice1').patchValue(item.expensesAmount);
    }

    onExpensesCalVat() {
        const expVatPrice1 = (this.formExpenses.get('expIsVat').value && this.formExpenses.get('expPrice1').value)
            ? this.formExpenses.get('expPrice1').value * 0.07
            : 0;
        this.formExpenses.get('expVatPrice1').patchValue(expVatPrice1);
    }

    onOtherCalVat() {
        const otVatPrice1 = (this.formExpenses.get('otIsVat').value && this.formExpenses.get('otPrice1').value)
            ? this.formExpenses.get('otPrice1').value * 0.07
            : 0;
        this.formExpenses.get('otVatPrice1').patchValue(otVatPrice1);
    }

    onItemCalVat(index) {
        let list = this.CarRegisListItem.at(index);
        const vat = list.get('itemIsVat').value && list.get('itemPrice1').value
            ? list.get('itemPrice1').value * 0.07
            : 0;
        list.get('itemVatPrice1').patchValue(vat);
    }

    onRemoveListItem(index: number) {
        const item = this.CarRegisListItem.at(index);
        if (confirm(`ยืนยันการลบรายการ "${item.get('itemName').value}" หรือไม่?`))
            this.CarRegisListItem.removeAt(index);
    }

    emitValue(value: any[]) {
        const obj = [...value];
        this.TagListItem.emit(obj)
    }

    emitValueTagHistory(value: any) {
        let obj = { ...value };
        const tagRegis = getDateMyDatepicker(obj.tagRegis);
        const tagExpire = getDateMyDatepicker(obj.tagExpire);
        const prbRegis = getDateMyDatepicker(obj.prbRegis);
        const prbExpire = getDateMyDatepicker(obj.prbExpire);
        const commitExpire = getDateMyDatepicker(obj.commitExpire);
        const warRegis = getDateMyDatepicker(obj.warRegis);
        const warExpire = getDateMyDatepicker(obj.warExpire);

        obj = {
            ...obj,
            tagRegis: tagRegis ? tagRegis.toISOString() : null,
            tagExpire: tagExpire ? tagExpire.toISOString() : null,
            prbRegis: prbRegis ? prbRegis.toISOString() : null,
            prbExpire: prbExpire ? prbExpire.toISOString() : null,
            commitExpire: commitExpire ? commitExpire.toISOString() : null,
            warRegis: warRegis ? warRegis.toISOString() : null,
            warExpire: warExpire ? warExpire.toISOString() : null
        }
        this.TagHistory.emit(obj);
    }

}  