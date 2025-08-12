import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CurrentUserService } from './services/currentUser.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { User } from './models/User';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
  
  constructor(private bnIdle: BnNgIdleService, 
              private currenteUserService: CurrentUserService,
              private router: Router) { 
    this.bnIdle.startWatching(600).subscribe((res) => {
      if(res) {
        
        var user = JSON.parse(sessionStorage.getItem('user')!) as User;
        if (user) {
          console.log("session expired");
          this.currenteUserService.logout();
          this.router.navigate(['/auth/login']);
        }
      }
    })
  }

}
