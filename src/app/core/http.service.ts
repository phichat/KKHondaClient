import { Injectable } from '@angular/core';
import {
    Http,
    RequestOptionsArgs,
    Response,
    Headers,
    XHRBackend
} from '@angular/http';

import { AngularReduxRequestOptions } from './angular-redux-request.options';

import { LoaderService } from './loader/loader.service';
import { appConfig } from '../app.config';
import { catchError, tap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})
export class HttpService extends Http {
    apiUrl = `${appConfig.apiUrl}/`;

    constructor(
        backend: XHRBackend,
        defaultOptions: AngularReduxRequestOptions,
        private loaderService: LoaderService
    ) {
        super(backend, defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {

        this.showLoader();
  
        return super.get(this.getFullUrl(url), this.requestOptions(options))
            .pipe(
                catchError(this.onCatch),
                tap((res: Response) => {
                    this.onSuccess(res);
                }, (error: any) => {
                    this.onError(error);
                }),
                finalize(() => this.onEnd())
            );
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        this.showLoader();

        return super.post(this.getFullUrl(url), body, this.requestOptions(options))
            .pipe(
                catchError(this.onCatch),
                tap((res: Response) => {
                    this.onSuccess(res);
                }, (error: any) => {
                    this.onError(error);
                }),
                finalize(() => this.onEnd())
            )
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        this.showLoader();

        return super.put(this.getFullUrl(url), body, this.requestOptions(options))
            .pipe(
                catchError(this.onCatch),
                tap((res: Response) => {
                    this.onSuccess(res);
                }, (error: any) => {
                    this.onError(error);
                }),
                finalize(() => this.onEnd())
            )
    }

    private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {

        if (options == null) {
            options = new AngularReduxRequestOptions();
        }

        if (options.headers == null) {
            options.headers = new Headers();
        }

        return options;
    }

    private getFullUrl(url: string): string {
        return this.apiUrl + url;
    }

    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }

    private onSuccess(res: Response): void {
        console.log('Request successful');
    }

    private onError(res: Response): void {
        console.log('Error, status code: ' + res.status);
    }

    private onEnd(): void {
        this.hideLoader();
    }

    private showLoader(): void {
        this.loaderService.show();
    }

    private hideLoader(): void {
        setTimeout(() => {
            this.loaderService.hide();
        }, 500);
    }
}
