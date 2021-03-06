import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { BookingModel, BookingListModel } from '../../models/selling';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'app/core/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class BookingService {

    private api = 'Selling/Booking';
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
        const apiURL = `${this.api}/GetById`;
        const params = { bookingId }
        return this.httpService.get(apiURL, { params });
    }

}
