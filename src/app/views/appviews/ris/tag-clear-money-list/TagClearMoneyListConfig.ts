import { RisConfig } from '../ris.config';
import { SedStatus, RevStatus } from 'app/entities/ris.entities';
import { ActionMode } from 'app/entities/general.entities';
export class TagClearMoneyListConfig extends RisConfig {
  RevList: any[] = [];
  loading: number;
  RevStatus = RevStatus;
  ActionMode = ActionMode;
}
