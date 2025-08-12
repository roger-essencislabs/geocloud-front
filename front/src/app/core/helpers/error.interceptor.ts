import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/services/currentUser.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private currentUseService: CurrentUserService,
                private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.currentUseService.logout();
                this.router.navigate(['/auth/login']);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}
