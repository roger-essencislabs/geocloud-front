import { Component } from '@angular/core';
import { ProfilesComponent } from '../profiles.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonModule } from '@angular/common';
import { NgbDropdown, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AvatarListComponent } from "src/app/shared/avatar-list/avatar-list.component";

@Component({
  selector: 'app-profiles-grid',
  templateUrl: './profiles-grid.component.html',
  styleUrls: ['./profiles-grid.component.scss'],
  standalone:true,
  imports: [
    FormsModule,
    PaginationModule,
    CommonModule,
    NgbDropdownModule,
    AvatarListComponent
]
})
export class ProfilesGridComponent {

  constructor(public  msApp: ProfilesComponent) { }

  ngOnInit(): void {
    console.log(this.msApp)
  }

}
