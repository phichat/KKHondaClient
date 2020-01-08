import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';

// App views
import { AppviewsModule } from './views/appviews/appviews.module';

// App modules/components
import { LayoutsModule } from './components/common/layouts/layouts.module';
import { HttpClientModule } from '@angular/common/http';
// import { PageloaderModule } from './views/appviews/pageloader/pageloader.module';
import { BookingModule } from './views/dashboards/booking/booking.module';
import { GuardGuard } from './guards/guard.guard';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CurrecyPipe } from './pipes/currency.pipe';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    CoreModule,
    LayoutsModule,
    AppviewsModule,
    RouterModule.forRoot(ROUTES, { scrollPositionRestoration: 'top' }),

    // PageloaderModule,
    BookingModule,
    BrowserAnimationsModule,
    // MatDatepickerModule,
    // MatInputModule,
    // MatFormFieldModule
  ],
  providers: [
    GuardGuard,
    // CurrecyPipe,
    { provide: LOCALE_ID, useValue: "th-TH" },
    { provide: APP_BASE_HREF, useValue: '/KK-Honda' },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
