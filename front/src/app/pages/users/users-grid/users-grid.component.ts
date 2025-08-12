import { Component } from '@angular/core';
import { UsersComponent } from '../users.component';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbDropdownModule, NgbHighlight, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    PaginationModule,
    CommonModule,
    NgbProgressbar,
    NgbDropdownModule
  ]
})
export class UsersGridComponent {

  image$ = new Observable<string>();
  constructor(public  msApp: UsersComponent) { 
    this.image$ = this.msApp.getObservableImageUrl();
  }
  

}
