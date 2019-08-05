import { OnInit, Component } from '@angular/core';

@Component({
    selector: 'app-list-item-component',
    templateUrl: './list-item.component.html'
})
export class ListItemComponent implements OnInit {
        
    constructor() { }

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
}