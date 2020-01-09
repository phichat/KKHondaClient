import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'jquery-slimscroll';
import { appConfig } from '../../../app.config';
import { UserService } from '../../../services/users';
import { IUserResCookie } from 'app/interfaces/users';

declare var jQuery: any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html'
})

export class NavigationComponent {

  public kkHondaWeb = appConfig.apikkWeb;
  user: IUserResCookie;

  constructor(
    private router: Router, 
    private userServiec: UserService) {
    this.user = this.userServiec.cookies;
  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  signOut() {
    this.userServiec.signOut();
  }

}
