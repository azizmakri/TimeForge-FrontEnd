import { Component } from '@angular/core';
import {User, UserService} from '../../user/user.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PartnershipService, StrategicPartnership} from '../strategicparternship.service';
import {FormsModule} from '@angular/forms';
import {UserAutocompleteComponent} from '../userautocomplete/userautocomplete.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-update-partnership',
  imports: [
    FormsModule,
    UserAutocompleteComponent,
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './update-partnership.component.html',
  styleUrl: './update-partnership.component.css'
})
export class UpdatePartnershipComponent {
  partnership: StrategicPartnership = {
    name: '',
    description: '',
    participants: []
  };
  selectedUsers: {
    id: string;
    name: string;
    email: string;
    workspaceId: string;
    collaborationId: string;
    goalId: string
  }[] = [];
  isLoading = false;
  formSubmitted = false;
  isEditMode = true;
  errorMessage: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipService: PartnershipService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPartnership(id);
    }
  }

  loadPartnership(id: string): void {
    this.isLoading = true;
    this.partnershipService.getPartnership(id).subscribe({
      next: (partnership) => {
        this.partnership = partnership;
        this.loadParticipants(partnership.participants);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load partnership';
        this.isLoading = false;
      }
    });
  }

  loadParticipants(participantIds: string[]): void {
    if (participantIds.length > 0) {
      this.userService.getNamessByIds(participantIds).subscribe({
        next: (users) => {
          this.selectedUsers = Object.values(users).map(user => ({
            id: user.id,
            name: user.name,
            email: user.email || '',
            workspaceId: user.workspaceId || '',
            collaborationId: user.collaborationId || '',
            goalId: user.goalId || ''
          }));
          this.partnership.participants = participantIds;
        },
        error: (err) => console.error('Failed to load participants', err)
      });
    }
  }

  onUsersSelected(users: User[]): void {
    this.selectedUsers = [...this.selectedUsers, ...users];
    this.partnership.participants = this.selectedUsers.map(u => u.id);
  }

  removeUser(user: {
    id: string;
    name: string;
    email: string;
    workspaceId: string;
    collaborationId: string;
    goalId: string
  }): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    this.partnership.participants = this.selectedUsers.map(u => u.id);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (!this.partnership.name || this.partnership.participants.length === 0) {
      return;
    }

    this.isLoading = true;
    this.partnershipService.updatePartnership(this.partnership.id,this.partnership).subscribe({
      next: () => {
        this.router.navigate(['/partnerships']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update partnership';
        this.isLoading = false;
      }
    });
  }
}
