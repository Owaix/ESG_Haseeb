import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authenticated = new BehaviorSubject<boolean>(false);
    private email: string | null = null;
    isAuthenticated = this.authenticated.asObservable();

    constructor() {
        const savedAuth = localStorage.getItem('isAuthenticated') === 'true';
        this.authenticated.next(savedAuth);
        this.email = savedAuth ? localStorage.getItem('userEmail') : null;
    }

    login(email: string) {
        this.email = email;
        this.authenticated.next(true);

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
    }

    logout() {
        this.email = null;
        this.authenticated.next(false);
        localStorage.clear();
    }

    getUserEmail(): string | null {
        return this.email;
    }
}
