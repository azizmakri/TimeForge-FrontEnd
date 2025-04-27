import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet, UrlTree} from '@angular/router';
import {User, UserService} from '../../user/user.service';
import {NgIf} from '@angular/common';
import {Subscription} from 'rxjs';
import {UserStateService} from '../../user/user-state-service.service';

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  standalone: true,
  styleUrls: ['./private-layout.component.css']
})
export class PrivateLayoutComponent implements OnInit,OnDestroy {
  private userSubscription!: Subscription;
  user: any = null;

  users: User[] = [];

  constructor(private router: Router,
              private userService: UserService,
              private userStateService: UserStateService
  ) {}

  ngOnInit(): void {

    // Safely get and parse user data
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      try {
        this.user = JSON.parse(userData);
        this.userStateService.updateUser(this.user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearInvalidUserData();
      }
    } else {
      this.user = null;
    }

    this.loadUsers();
  }
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
  private clearInvalidUserData(): void {
    localStorage.removeItem('user');
    this.user = null;
  }

  private loadUsers(): void {
    this.userService.findAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Failed to load users:', err)
    });
  }
  toggleSidebar() {
    const wrapper = document.getElementById('wrapper');
    wrapper?.classList.toggle('toggled');
  }


  logout(): void {
    // Clear the token and user data from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');

    // Redirect the user to the login page
    this.router.navigate(['/login']);
  }

  getPhotoUrl(): string | null {
    if (!this.user?.photoBase64 || !this.user.photoContentType) return null;
    return `data:${this.user.photoContentType};base64,${this.user.photoBase64}`;
  }
}
