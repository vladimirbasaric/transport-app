import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {}

    httpOptions = {
        headers: new HttpHeaders({'Content-Type':'application/json'})
    }

    private loginUrl = 'https://port-app.com/api/login';

    loginUser(user): Observable<any> {
       return this.http.post(this.loginUrl, user, this.httpOptions);
    }

    loggedIn() {
        return !!localStorage.getItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }
}