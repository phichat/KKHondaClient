import { RisConfig } from '../ris.config';
import { RevStatus, RevStatusList } from 'app/entities/ris.entities';
import { ActionMode } from 'app/entities/general.entities';
import { FormGroup } from '@angular/forms';
export class TagClearMoneyListConfig extends RisConfig {
  formSearch: FormGroup;
  RevList: any[] = [];
  loading: number;
  RevStatusList = RevStatusList;
  RevStatus = RevStatus;
  ActionMode = ActionMode;
}
