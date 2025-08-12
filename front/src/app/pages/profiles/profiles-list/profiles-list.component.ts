import { Component } from '@angular/core';
import { ProfilesComponent } from '../profiles.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbAccordionModule, NgbHighlight, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AvatarListComponent } from 'src/app/shared/avatar-list/avatar-list.component';

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
  styleUrls: ['./profiles-list.component.scss'],
  standalone:true,
  imports: [
    FormsModule,
    PaginationModule,
    CommonModule,
    NgbHighlight,
    AvatarListComponent
  ]
})

export class ProfilesListComponent {

  constructor(public  msApp: ProfilesComponent) { }

  ngOnInit(): void {
    
  }

}
