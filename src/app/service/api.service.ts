import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from './env';
import { User } from '../models/User';

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor(private http: HttpClient) { }
    register(user: User): Observable<any> {
        return this.http.post(environment.BASE_URL + 'auth/signup', user);
    }
    login(user: User): Observable<any> {
        return this.http.post(environment.BASE_URL + 'auth/login', user, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }
    Getcategories(): Observable<any> {
        return this.http.get(environment.BASE_URL + 'company/categories');
    }
    GetProfile(): Observable<any> {
        return this.http.get(environment.BASE_URL + 'company/categories');
    }
    get_profile(): Observable<any> {
        return this.http.get(environment.BASE_URL + 'company/profile');
    }
    get_topics(): Observable<any> {
        return this.http.get(environment.BASE_URL + 'topic/list');
    }
    get_subtopics(id: number): Observable<any> {
        return this.http.get(environment.BASE_URL + 'topic/subtopics/' + id);
    }

    get_question(id: string, report_id: string): Observable<any> {
        return this.http.get(environment.BASE_URL + 'topic/question/' + id + '/report/' + report_id);
    }

    verify(token: any): Observable<any> {
        return this.http.post(environment.BASE_URL + 'auth/verify', token);
    }

    submit_report(obj: any): Observable<any> {
        return this.http.post(environment.BASE_URL + 'report/submit', obj);
    }

    complete_report(obj: any): Observable<any> {
        return this.http.post(environment.BASE_URL + 'report/complete', obj);
    }

    re_verify(token: any): Observable<any> {
        return this.http.post(environment.BASE_URL + 'auth/verify/resend', token);
    }
    get_questions(numberOfCalls: string[], report_id: string): Observable<any[]> {
        const apiCalls: Observable<any>[] = [];
        for (let i = 0; i < numberOfCalls.length; i++) {
            apiCalls.push(this.http.get(environment.BASE_URL + 'topic/question/' + numberOfCalls[i] + '/report/' + report_id));
        }
        return forkJoin(apiCalls);
    }
    SaveQuestions(user: any): Observable<any> {
        return this.http.post(environment.BASE_URL + 'report/answer', user);
    }
    update_profile(user: User): Observable<any> {
        return this.http.put(environment.BASE_URL + 'users/update_profile', user);
    }
    topic_answer(report_id: string, topic_id: string): Observable<any> {
        return this.http.get(environment.BASE_URL + 'report/' + report_id + '/topic/' + topic_id);
    }
    history(): Observable<any> {
        return this.http.get(environment.BASE_URL + 'report/history');
    }
    historys(): Observable<any> {
        return this.http.get<any>(environment.BASE_URL + 'report/history').pipe(
            map(response => {
                response.data = response.data.map((report: any) => ({
                    ...report,
                    is_generated: false
                }));
                return response;
            })
        );
    }
    sendResetmail(email: any): Observable<any> {
        return this.http.post(environment.BASE_URL + 'auth/reset/request', email);
    }
    resetpass(email: any): Observable<any> {
        return this.http.post(environment.BASE_URL + 'auth/reset/password', email);
    }
}