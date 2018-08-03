import { Component } from '@angular/core';
import { PageloaderService } from './views/appviews/pageloader/pageloader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isPreloader: any;

  constructor(private pageloader: PageloaderService) {
    this.isPreloader = this.pageloader.showPageloader;
  }
  
}
