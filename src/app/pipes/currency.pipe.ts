// import { Pipe, PipeTransform } from '@angular/core';
// import { formatCurrency, getCurrencySymbol } from '@angular/common';

// @Pipe({
//   name: 'currency'
// })

// export class CurrecyPipe implements PipeTransform {
//   transform(
//     value: number,
//     currencyCode: string = 'EUR',
//     display:
//       | 'code'
//       | 'symbol'
//       | 'symbol-narrow'
//       | string
//       | boolean = 'symbol',
//     digitsInfo: string = '1.2-2',
//     locale: string = 'th',
//   ): string | null {
//     let retNumber = Number(value);
//     if (isNaN(retNumber)) return `${value}`;
//     return formatCurrency(
//       value,
//       locale,
//       // getCurrencySymbol(currencyCode, 'wide'),
//       // currencyCode,
//       digitsInfo,
//     );
//   }
// }