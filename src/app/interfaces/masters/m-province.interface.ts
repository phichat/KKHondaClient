import { IMAmpher } from './m-ampher.interface';

export interface IMProvince {
  provinceCode: string;
  provinceZone: string;
  provinceNameTh: string;
  provinceNameEn: string;
  abbrName: string;
  isoCode: string;
  createBy: string;
  createDate?: Date;
  updateBy: string;
  updateDate?: Date;
  mAmphor: IMAmpher[];
}

