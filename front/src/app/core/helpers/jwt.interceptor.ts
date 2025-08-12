import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(public router:Router) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        
        var user = JSON.parse(sessionStorage.getItem('user')!) as User;
        if (user && user.token) {
            //console.log('jwt interceptor + token');
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
        } else {
            console.log('jwt interceptor');
        }
        return next.handle(request);
        
    }
}
