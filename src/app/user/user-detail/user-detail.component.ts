// user-detail.component.ts
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';

import { CommonModule } from '@angular/common';
import {Role, User, UserService} from '../user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  error: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load user details';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.error = 'No user ID provided';
      this.isLoading = false;
    }
  }

  getRoleName(role: Role): string {
    return Role[role as keyof typeof Role];
  }
  getPhotoUrl(): string | null {
    if (!this.user?.photoBase64 || !this.user.photoContentType) return null;
    return `data:${this.user.photoContentType};base64,${this.user.photoBase64}`;
  }

}
