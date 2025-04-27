import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {UserService} from '../../user/user.service';
import {AuthService} from '../../auth.service';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.snackBar.open('Invalid reset link', 'Close', { duration: 5000 });
      this.router.navigate(['/login']);
    }
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit(): void {
    // Vérifie si le formulaire est invalide ou si le token est manquant
    if (this.resetForm.invalid || !this.token) {
      this.snackBar.open('Veuillez remplir tous les champs correctement.', 'Fermer', { duration: 4000 });
      return;
    }

    this.isLoading = true;
    const { password } = this.resetForm.value;

    console.log('Sending reset with:', { token: this.token, password });

    this.authService.resetPassword(this.token, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Mot de passe réinitialisé avec succès ✅', 'Fermer', { duration: 5000 });

      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Mot de passe réinitialisé avec succès ✅', 'Fermer', { duration: 5000 });
      }
    });
  }

}
