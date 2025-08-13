import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/services/currentUser.service';
import { ToastService } from './toast-service';
import { ToastsContainer } from './toasts-container.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
      ToastsContainer,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
    ]
})

export class LoginComponent implements OnInit {

  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  year: number = new Date().getFullYear();
  toast!: false;

  constructor(private formBuilder: UntypedFormBuilder,
              private currentUserService: CurrentUserService,
              private router: Router,
              public toastService: ToastService) { }

  ngOnInit(): void {
     this.loginForm = this.formBuilder.group({
      email: ['test@test', [Validators.required, Validators.email]],
      password: ['test@2025', [Validators.required]],
    });
  }

  get f() { return this.loginForm.controls; }

   onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    var e = this.loginForm.controls['email'].value;
    var p = this.loginForm.controls['password'].value;
   
    this.currentUserService.login(e, p).subscribe({
      next: () => {
        //Navigate to Dashboard
        this.router.navigate(['']);
      },
      error: (error) => {
        console.log(error);
        this.toastService.show(error, { classname: 'bg-danger text-white', delay: 5000 });
      }
    })
  }

   // Password Hide/Show
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
