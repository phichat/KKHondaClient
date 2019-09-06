import { RisConfig } from '../ris.config';
import { SedStatus } from 'app/entities/ris.entities';
export class TagClearMoneyListConfig extends RisConfig {
  SedList: any[] = [];
  loading: number;
  SedStatus = SedStatus;
}
