import { FormArray, FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { setLocalDate } from 'app/app.config';
import * as $ from 'jquery';
import { SedStatus } from 'app/entities/ris.entities';

export class TagConcludeConfig {
    get ConList(): FormArray {
        return this.formGroup.get('conList') as FormArray;
    }

    get ConListIsSelect(): any[] {
        return this.ConList.value.filter(x => x.IS_CHECKED);
    }

    public displayLocalDate = setLocalDate;
    public checkedAll: boolean;
    public mUser: ModelUser;
    public formGroup: FormGroup;
    public dataTable: any;
    public loading: number;

    public SedStatus = SedStatus;

    public initDatatable(): void {
        let table: any = $('table');
        this.dataTable = table.DataTable({
            scrollX: true,
            scrollY: '35vh',
            scrollCollapse: true,
            paging: false,
            "columns": [
                null,
                { "orderable": false },
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            ]
        });
    }

    public reInitDatatable(): void {
        this.destroyDatatable()
        setTimeout(() => this.initDatatable(), 0)
    }

    public destroyDatatable() {
        if (this.dataTable) {
            this.dataTable.destroy();
            this.dataTable = null;
        }
    }
}