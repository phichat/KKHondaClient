import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { getCookie } from 'app/app.config';

@Injectable()
export class GuardGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // if (getCookie('id')) {
    //   // logged in so return true
    //   return true;
    // }

    // // not logged in so redirect to login page with the return url
    // // , { queryParams: { returnUrl: state.url } }
    // window.location.href = 'http://203.154.126.61/KK-Honda-Web/backoffice/login.php';
    // return false;
    return true;
  }

}
