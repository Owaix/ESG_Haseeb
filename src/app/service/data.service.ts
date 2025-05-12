import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private dataSource = new BehaviorSubject<any>(this.getStoredData());
    currentData = this.dataSource.asObservable();

    constructor() { }

    changeData(data: any) {
        this.dataSource.next(data);
        localStorage.setItem('storedData', JSON.stringify(data));
    }

    getStoredData(): any {
        const data = localStorage.getItem('storedData');
        return data ? JSON.parse(data) : null;
    }
}
