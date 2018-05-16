import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare var jQuery: any;

@Directive({
  selector: '[appSelectizeFinancial]'
})
export class SelectizeFinancialDirective implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    jQuery(this.el.nativeElement).selectize({
      create: false,
      options: [
        {class: 'leasing', value: "1", name: "ขาย KTC" },
        {class: 'leasing', value: "2", name: "ขาย กรุ๊ปลีส" },
        {class: 'leasing', value: "3", name: "ขาย ซัมมิท" },
        {class: 'leasing', value: "4", name: "ขาย ฐิติกร" },
        {class: 'hire-purchase', value: '5', name: 'ขายผ่อน'},
        {class: 'hire-purchase', value: '6', name: 'ขายผ่อนรีไฟแนนซ์'},
        {class: 'hire-purchase', value: '7', name: 'เกริกไกรเอ็นเตอร์ไพร์ส'}
       
      ],
      optgroups: [
        {value: 'leasing', label: 'ประเภท :', label_scientific: 'ลิสซิ่ง'},
        {value: 'hire-purchase', label: 'ประเภท :', label_scientific: 'เช่าซื้อ'},
      ],
      optgroupField: 'class',
      labelField: 'name',
      searchField: ['name'],
      render: {
        optgroup_header: function(data, escape) {
          return '<div class="optgroup-header"><h4 class="m-b-xs">' + escape(data.label) + ' <span class="scientific">' + escape(data.label_scientific) + '</span></h4></div>';
        }
      }
    });
  }
}
