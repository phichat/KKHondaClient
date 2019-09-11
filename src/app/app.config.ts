import { IMyOptions, IMyDateModel } from "mydatepicker-th";
import { DropDownModel } from './models/drop-down-model';
import { AutoCompleteModel } from './models/auto-complete-model';

export const appConfig = {
    apiUrl: 'http://203.154.126.61/kk-honda-api/api',
    reportUrl: 'http://203.154.126.61/kk-honda-report',
    apikkWeb: 'http://203.154.126.61/KK-Honda-Web/backoffice',
    // apiUrl: 'http://localhost:53076/api'
}

export const MyDatePickerOptions: IMyOptions = {
    dateFormat: 'dd / mm / yyyy',
    showClearDateBtn: true,
    height: '32px',
    openSelectorOnInputClick: true,
    editableDateField: false
};

export function resetLocalDate(date: string): string {
    if (date === '' || date == null) {
        return null;
    }

    const _d = date.split('/');

    if (_d.length <= 1) {
        return date;
    }

    const _date = new Date(`${_d[2].trim()}-${_d[1].trim()}-${_d[0].trim()}`);
    const dd = setZero(_date.getDate());
    const mm = setZero(_date.getMonth() + 1);
    const yyyy = _date.getFullYear() - 543;

    return `${yyyy}-${mm}-${dd}`;
}

export function setLocalDate(date: string): string {
    if (date === '' || date == null) {
        return null;
    }

    const _date = new Date(date)
    const dd = setZero(_date.getDate());
    const mm = setZero(_date.getMonth() + 1);
    const yyyy = _date.getFullYear() + 543;

    return `${dd} / ${mm} / ${yyyy}`;
}

export function setZero(num: number) {
    return num < 10 ? '0' + num : num;
}

export function setDateMyDatepicker(date: Date) {
    if (!date)
        return { myDate: null };

    date = new Date(date);
    return { date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } }
}

export function getDateMyDatepicker(date: IMyDateModel): Date {
    if (!date || !date.date)
        return null;

    const d = date.date
    return new Date(`${d.year}-${d.month}-${d.day}`);
}

export function setZeroHours(date: Date): string {
    if (!date)
        return null;

    date = new Date(date);
    date.setHours(0, -date.getTimezoneOffset(), 0, 0);
    return date.toISOString();
}

export function currencyToFloat(str: any): number {
    if (str == undefined) return 0.0;
    return parseFloat(str.replace(/,/i, ''));
}

export function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function mapDropDownnToAutoComplete(dd: DropDownModel[]): AutoCompleteModel[] {
    return dd.map(c => {
        return { id: c.value, name: c.text };
    })
}

export function mapAutoCompleteIdToString(arr: AutoCompleteModel[]): string {
    return arr.map(x => x.id).join(',');
}
