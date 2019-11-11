// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(private cookieService: CookieService ) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     request = request.clone({
//       withCredentials: true,
//     });
//     return next.handle(request);
//   }

// }
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HeaderInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = req.headers.set('Content-Type', 'application/json');
    const authReq = req.clone({ 
      headers, 
      withCredentials: true,
    });
    return next.handle(authReq);
  }
}