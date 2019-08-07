import { setLocalDate, appConfig, MyDatePickerOptions } from 'app/app.config';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';

export class RisConfig {

  public displayLocalDate = setLocalDate;
  public dataTable: any;
  myDatePickerOptions = MyDatePickerOptions;
  public apiURL = `${appConfig.apiUrl}/Ris`;

  public initDatatable(): void {
    let table: any = $('table');
    this.dataTable = table.DataTable({
      "scrollX": true,
      // "columns": [
      //   null,
      //   { "orderable": false },
      //   null,
      //   null,
      //   null,
      //   null,
      //   null
      // ]
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