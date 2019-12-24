import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'us-currency'
})

export class UsCurrencyPipe implements PipeTransform {
  transform(value: any, 
    ...args: any[]
    ): any {
    
  }
}