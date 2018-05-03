import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

// Modules
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';

// Components
import { StarterViewComponent } from "./starterview.component";
import { LoginComponent } from "./login.component";

import { PeityModule } from '../../components/charts/peity';
import { SparklineModule } from '../../components/charts/sparkline';
import { HomeComponent } from './home/home.component';
import { StarterComponent } from './starter/starter.component';

// Directives
import { IcheckDirective } from "../../directives/icheck.directive";
import { FootableDirective } from "../../directives/footable.directive";

import { FormsModule } from "@angular/forms";
import { InputmaskDirective } from "../../directives/inputmask.directive";
import { SellingModule } from "./selling/selling.module";

@NgModule({
  declarations: [
    // Directives

    // Components
    StarterViewComponent,
    LoginComponent,
    HomeComponent,
    StarterComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    PeityModule,
    SparklineModule,
    IboxtoolsModule,
    SellingModule
  ],
  exports: [
    // IcheckDirective
  ],
  providers: [
    // ProductService
  ]
})

export class AppviewsModule {
}
