import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare var jQuery: any;

@Directive({
  selector: '[appSelectizeSearchCustomer]'
})
export class SelectizeSearchCustomerDirective implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
      '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

    jQuery(this.el.nativeElement).selectize({
      persist: false,
      maxItems: null,
      valueField: 'email',
      labelField: 'name',
      searchField: ['name', 'email'],
      options: [
        { email: 'brian@thirdroute.com', name: 'Brian Reavis' },
        { email: 'nikola@tesla.com', name: 'Nikola Tesla' },
        { email: 'someone@gmail.com' }
      ],
      render: {
        item: function (item, escape) {
          return '<div>' +
            (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
            (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
            '</div>';
        },
        option: function (item, escape) {
          const label = item.name || item.email;
          const caption = item.name ? item.email : null;
          return '<div>' +
            '<span class="label">' + escape(label) + '</span>' +
            (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
            '</div>';
        }
      },
      createFilter: function (input) {
        let match: any;
        let regex: any;

        // email@address.com
        regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
        match = input.match(regex);
        if (match) { return !this.options.hasOwnProperty(match[0]) };

        // name <email@address.com>
        regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
        match = input.match(regex);
        if (match) { return !this.options.hasOwnProperty(match[2]) };

        return false;
      },
      create: function (input) {
        if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
          return { email: input };
        }
        const match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
        if (match) {
          return {
            email: match[2],
            name: jQuery.trim(match[1])
          };
        }
        alert('Invalid email address.');
        return false;
      }
    });
  }

}
