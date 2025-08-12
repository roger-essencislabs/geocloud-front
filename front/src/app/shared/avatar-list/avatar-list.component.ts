import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfilesComponent } from 'src/app/pages/profiles/profiles.component';

@Component({
  selector: 'app-avatar-list',
  templateUrl: './avatar-list.component.html',
  styleUrl: './avatar-list.component.scss',
  standalone: true,
  imports: [
    NgbTooltipModule,
    CommonModule
  ],
})
export class AvatarListComponent {
  
  constructor(public  msApp: ProfilesComponent) { }
  
  @Input() profileName?:string;
}
