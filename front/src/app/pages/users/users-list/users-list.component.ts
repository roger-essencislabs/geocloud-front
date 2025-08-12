import { Component } from '@angular/core';
import { UsersComponent } from '../users.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    PaginationModule,
    CommonModule,
    NgbHighlight
  ]
})

export class UsersListComponent {

  constructor(public  msApp: UsersComponent) { }

  ngOnInit(): void {
 
  }

}

