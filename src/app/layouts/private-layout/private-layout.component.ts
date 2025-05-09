import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet, UrlTree} from '@angular/router';
import {User, UserService} from '../../user/user.service';
import { NgIf, AsyncPipe, NgForOf, NgClass } from '@angular/common'; // ✅ Add NgForOf
import {Observable, Subscription} from 'rxjs';
import {UserStateService} from '../../user/user-state-service.service';
import { CollaborationService } from '../../collaboration/collaboration.service';
import { NotificationModel } from '../../models/notification.model';
import { NotificationService } from '../../chat/NotificationService/notification.service';

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgForOf,
    AsyncPipe,
    NgClass
  ],
  standalone: true,
  styleUrls: ['./private-layout.component.css']
})
export class PrivateLayoutComponent implements OnInit,OnDestroy {
  hasNewNotification = false;
  notifications: NotificationModel[] = [];
  private userSubscription!: Subscription;
  user: any = null;

  users: User[] = [];

  constructor(private router: Router,
              private userService: UserService,
              private userStateService: UserStateService,
              private collabService:CollaborationService,
              private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      try {
        this.user = JSON.parse(userData);
        this.userStateService.updateUser(this.user);
  
        this.notificationService.connect(this.user.id, (notification: NotificationModel) => {
          this.notifications.unshift(notification);
          this.hasNewNotification = true; // 🔴 Turn bell red
        });
        
  
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearInvalidUserData();
      }
    } else {
      this.user = null;
    }
  
    this.loadUsers();
    this.loadNotifications(); // still uses collabService

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
  onNotificationDropdownClick(): void {
    this.hasNewNotification = false; // ⚪ Turn bell back to white
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


  getCollabById(id: string): void {
    console.log('Collab ID:', id);
    this.collabService.getCollabById(id).subscribe(collab => {
      console.log("Returned collaboration:", collab);
        this.router.navigate(['/chat', id.toString()]);
    });
  }


  loadNotifications(): void {
    const userId = this.user.id;
    if (!userId) {
      console.error('No user ID found in localStorage.');
      return;
    }
  
    this.collabService.getNotificationsByUser(userId).subscribe({
      next: (notifications) => this.notifications = notifications,
      error: (err) => console.error('Failed to load notifications:', err)
    });

  }
  
  
}
