import {Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {catchError, of} from 'rxjs';
import {NgIf} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    ButtonDirective
  ],
  standalone: true,
  styleUrls: ['./sign-up.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignUpComponent implements OnInit {
  showAnimation = true;
  signUpForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form with controls and validation rules
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
    setTimeout(() => {
      this.showAnimation = false;
    }, 45000);
  }

  // Getter methods to access form controls more easily
  get nameControl() {
    return this.signUpForm.get('name');
  }

  get emailControl() {
    return this.signUpForm.get('email');
  }

  get passwordControl() {
    return this.signUpForm.get('password');
  }

  get roleControl() {
    return this.signUpForm.get('role');
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const user = this.signUpForm.value;
      this.authService.register(user).pipe(
        catchError((error) => {
          // Check the entire error object for more details
          this.router.navigate(['/login']).then(r => console.log('Navigated to login page'));
          // If it's an error response, log more details about it
          if (error instanceof HttpErrorResponse) {
            this.errorMessage = `HTTP Error: ${error.status} - ${error.statusText}`;
          } else {
            this.errorMessage = 'There was an error registering the user';
          }

          return of(null);  // Return a fallback value to complete the observable
        })
      ).subscribe({
        next: (response) => {
          if (response) {
            console.log('User registered successfully', response);
            this.router.navigate(['/login']).then(r => console.log('Navigated to login page'));
          }
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

}
