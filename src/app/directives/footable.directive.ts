import { Directive, ElementRef } from '@angular/core';
declare var jQuery: any;

@Directive({
  selector: '[appFootable]'
})
export class FootableDirective {

  jQuery: any = jQuery;

  constructor(el: ElementRef) {
    this.jQuery(el.nativeElement).footable({
      "expandFirst": true,
      "columns": [
        { "name": "id", "visible": false },
        { "name": "firstName", "title": "First Name" },
        { "name": "lastName", "title": "Last Name" },
        { "name": "jobTitle", "title": "Job Title", "breakpoints": "xs" },
        { "name": "started", "title": "Started On", "breakpoints": "xs sm" },
        { "name": "dob", "title": "Date of Birth", "breakpoints": "all" }
      ],
      "rows": [
        { "id": 1, "firstName": "Dennise", "lastName": "Fuhrman", "jobTitle": "High School History Teacher", "started": "November 8th 2011", "dob": "July 25th 1960" },
        { "id": 2, "firstName": "Elodia", "lastName": "Weisz", "jobTitle": "Wallpaperer Helper", "started": "October 15th 2010", "dob": "March 30th 1982" },
        { "id": 3, "firstName": "Raeann", "lastName": "Haner", "jobTitle": "Internal Medicine Nurse Practitioner", "started": "November 28th 2013", "dob": "February 26th 1966" },
        { "id": 4, "firstName": "Junie", "lastName": "Landa", "jobTitle": "Offbearer", "started": "October 31st 2010", "dob": "March 29th 1966" },
        { "id": 5, "firstName": "Solomon", "lastName": "Bittinger", "jobTitle": "Roller Skater", "started": "December 29th 2011", "dob": "September 22nd 1964" },
        { "id": 6, "firstName": "Bar", "lastName": "Lewis", "jobTitle": "Clown", "started": "November 12th 2012", "dob": "August 4th 1991" },
        { "id": 7, "firstName": "Usha", "lastName": "Leak", "jobTitle": "Ships Electronic Warfare Officer", "started": "August 14th 2012", "dob": "November 20th 1979" },
        { "id": 8, "firstName": "Lorriane", "lastName": "Cooke", "jobTitle": "Technical Services Librarian", "started": "September 21st 2010", "dob": "April 7th 1969" }
      ]
    });
  }

}
