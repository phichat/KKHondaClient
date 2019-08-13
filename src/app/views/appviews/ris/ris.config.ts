import { setLocalDate, appConfig, MyDatePickerOptions, setDateMyDatepicker } from 'app/app.config';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { ActionMode } from 'app/entities/general.entities';
import { ConStatus, RisLocalStoreage as LS } from 'app/entities/ris.entities';

export class RisConfig {

  public displayLocalDate = setLocalDate;
  public dataTable: any;
  public ActionMode = ActionMode;
  public myDatePickerOptions = MyDatePickerOptions;
  public setDateMyDatepicker = setDateMyDatepicker;
  public risUrl = `${appConfig.apiUrl}/Ris`;
  public ConStatus = ConStatus;


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