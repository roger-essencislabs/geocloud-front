import { Component} from '@angular/core';

import { ToastService } from './toast-service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-toasts',
    template: `
   @for(toast of toastService.toasts;track $index){
    <ngb-toast
           [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      {{ toast.textOrTpl }}
    </ngb-toast>
   }
  `,
    host: { 'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 1200' },
    standalone: true,
    imports: [
      NgbToastModule,
      CommonModule
    ]
})
export class ToastsContainer {
  constructor(public toastService: ToastService) { }
}
