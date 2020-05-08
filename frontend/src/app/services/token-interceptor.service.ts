import { Injectable, Injector } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders, HttpInterceptor } from '@angular/common/http';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private injector: Injector) {}

    intercept(req, next) {
        let authService = this.injector.get(AuthService);
        let tokenizedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authService.getToken()}`
            }
        })
        return next.handle(tokenizedReq);
    }
}