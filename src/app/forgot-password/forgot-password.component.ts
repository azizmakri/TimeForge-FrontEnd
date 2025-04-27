import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  standalone: true,
  styleUrls: ['./forgot-password.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  showAnimation = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.forgotPasswordForm.value.email;

    // Solution 1: Expect text response
    this.http.post(
      'http://localhost:8100/timeforge/auth/forgot-password',
      { email },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text'  // Explicitly tell Angular to expect text
      }
    ).subscribe({
      next: (response) => {
        this.toastr.success(response || 'Password reset email sent!');
        this.loading = false;
      },
      error: (err) => {
        const errorMessage = this.getErrorMessage(err);
        this.toastr.error(errorMessage);
        console.error('Password reset error:', err);
        this.loading = false;
      }
    });

    /*
    // Solution 2: If you can modify backend to return JSON
    this.http.post<{message: string}>(
      'http://localhost:8100/timeforge/auth/forgot-password',
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.loading = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error sending email';
        this.toastr.error(errorMessage);
        this.loading = false;
      }
    });
    */
  }

  private getErrorMessage(error: any): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return 'Network error occurred';
    } else {
      // Server-side error
      try {
        // Try to parse as JSON if possible
        const parsedError = JSON.parse(error.error);
        return parsedError.message || 'Unknown server error';
      } catch (e) {
        // If not JSON, return raw error text
        return error.error || 'Unknown error occurred';
      }
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.showAnimation = false;
    }, 30000);
  }
}
