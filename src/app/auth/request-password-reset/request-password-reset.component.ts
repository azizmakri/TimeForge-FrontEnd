import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {UserService} from '../../user/user.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-request-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.css']
})
export class RequestPasswordResetComponent {
  resetForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    //if (this.resetForm.invalid) return;

  //  this.isLoading = true;
  //  const email = this.resetForm.value.email;

 //   this.authService.requestPasswordReset(email).subscribe({
 //     next: () => {
 //       this.snackBar.open('Reset link sent to your email', 'Close', { duration: 5000 });
 //       this.router.navigate(['/login']);
 //     },
 //     error: (err) => {
 //       this.isLoading = false;
  //      this.snackBar.open('Error sending reset link', 'Close', { duration: 5000 });
 //     }
 //   });
  }
}
