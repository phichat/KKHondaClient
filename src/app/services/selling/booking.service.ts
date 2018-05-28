import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { BookingModel, BookingListModel } from '../../models/selling';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BookingService {

    private api = `${appConfig.apiUrl}/Selling/Booking`;
    private model = new BookingModel();
    private dataSource = new BehaviorSubject<BookingModel>(this.model);

    currentData = this.dataSource.asObservable();

    constructor(private http: HttpClient) { }

    changeData(data: BookingModel) {
        this.dataSource.next(data)
    }

    get() {
        return this.http.get<BookingListModel[]>(this.api);
    }

    getById(bookingId: string) {
        const apiURL = `${this.api}/GetById`;
        const params = { bookingId }
        return this.http.get<BookingModel>(apiURL, { params });
    }

}
