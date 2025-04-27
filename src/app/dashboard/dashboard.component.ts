import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // If user is not authenticated, redirect to login page
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  onLogout(): void {
    // Call the logout method in the AuthService
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }
}
