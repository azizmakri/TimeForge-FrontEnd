import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../auth.service';  // Import the AuthService
import {Router, RouterLink} from '@angular/router';

import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule,

    RouterLink,

    NgIf
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  username: string = '';
  password: string = '';
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}



  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

  }


  login(): void {
    if (this.username && this.password) {
      this.authService.login({ email: this.username, password: this.password }).subscribe(
        (response) => {
          this.authService.storeToken(response.token);
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        },
        (error) => {
          this.errorMessage = 'Invalid username or password';
        }
      );
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }


}
