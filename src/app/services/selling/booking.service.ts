import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookingModel, BookingListModel } from '../../models/selling';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'app/core/http.service';
import { Observable } from 'rxjs';
import { IBookingCarDetail } from 'app/interfaces/sellings';
import { appConfig } from 'app/app.config';
import { map } from 'rxjs/operators';

@Injectable()
export class BookingService {

    private api = `Selling/Booking`;
    private model = new BookingModel();
    private dataSource = new BehaviorSubject<BookingModel>(this.model);

    currentData = this.dataSource.asObservable();

    constructor(
        private http: HttpClient,
        private httpService: HttpService
    ) { }

    changeData(data: BookingModel) {
        this.dataSource.next(data)
    }

    get(): Observable<BookingListModel[]> {
        return this.httpService.get(this.api);
    }

    getById(bookingId: string) {
        const apiURL = `${appConfig.apiUrl}/${this.api}/GetById`;
        const params = { bookingId }
        return this.http.get<BookingModel>(apiURL, { params });
    }

    GetBookingCarDetail(bookingId: string): Observable<IBookingCarDetail> {
        const url = `${this.api}/GetBookingCarDetail`;
        const params = { bookingId };
        return this.httpService.get(url, { params }).pipe(map(x => x.json));
    }

}
