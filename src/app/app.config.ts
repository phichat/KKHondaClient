import { IMyOptions } from "mydatepicker-th";

export const appConfig = {
    // apiUrl: 'http://203.154.126.61/kk-honda-api/api',
    // reportUrl: 'http://203.154.126.61/kk-honda-report',
    apiUrl: 'http://localhost:53076/api',
    reportUrl: 'http://localhost:58874/'
}

export const MyDatePickerOptions: IMyOptions = {
    dateFormat: 'dd / mm / yyyy',
    showClearDateBtn: false,
    height: '30px'
};

export function resetLocalDate(date: string): string {
    if (date === '' || date == null) {
        return null;
    }

    const _d = date.split('/');

    if (_d.length <= 1){
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
        return null;

    date = new Date(date);
    return { date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } }
}

export function getDateMyDatepicker(date: any) {
    if (!date)
        return null;

    date = date.date
    return new Date(`${date.year}-${date.month}-${date.day}`);
}

export function setZeroHours(date: Date): string {
    if (!date)
        return null;

    date = new Date(date);
    date.setHours(0, -date.getTimezoneOffset(), 0, 0);
    return date.toISOString();
}

export function currencyToFloat(str: string) {
    return parseFloat(str.replace(/,/i, ''));
}
