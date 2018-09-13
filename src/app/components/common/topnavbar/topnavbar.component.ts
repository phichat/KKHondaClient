import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { UserService } from '../../../services/users';
declare var jQuery:any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent {

  constructor(private userService: UserService) {}

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  signOut() {
    this.userService.signOut();
  }
}
