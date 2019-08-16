import { OnInit, Component } from '@angular/core';
import { RisConfig } from '../ris.config';

@Component({
    selector: 'app-list-con-item-detail-component',
    templateUrl: './list-con-item-detail.component.html'
})
export class ListConItemDetailComponent extends RisConfig implements OnInit {
        
    constructor() { 
        super();
    }

    ngOnInit(): void {
    }
}