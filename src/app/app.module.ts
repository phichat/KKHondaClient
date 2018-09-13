import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';

// App views
import { AppviewsModule } from './views/appviews/appviews.module';

// App modules/components
import { LayoutsModule } from './components/common/layouts/layouts.module';
import { HttpClientModule } from '@angular/common/http';
import { PageLoadWarpperService } from './services/common/page-load-warpper.service';
import { PageloaderModule } from './views/appviews/pageloader/pageloader.module';
import { BookingModule } from './views/dashboards/booking/booking.module';
import { GuardGuard } from './guards/guard.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    LayoutsModule,
    AppviewsModule,
    RouterModule.forRoot(ROUTES),
    PageloaderModule,
    BookingModule
  ],
  providers: [
    GuardGuard,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
