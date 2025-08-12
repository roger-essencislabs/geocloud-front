import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
    constructor(private router: Router) { }

    canActivate() {

            if (sessionStorage.getItem('user')) {
                console.log('authguard ok');
                return true;
            } else {
                console.log('authguard not');
                this.router.navigate(['/auth/login']);
                return false;
            }
        }
    }
