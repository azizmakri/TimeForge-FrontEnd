import {Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnershipService, StrategicPartnership, BlockchainRecord } from '../strategicparternship.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {UserAutocompleteComponent} from '../userautocomplete/userautocomplete.component';
import {UserSearchService} from '../usersearch.service';


@Component({
  selector: 'app-add-partnership',
  templateUrl: './add-partnership.component.html',
  styleUrls: ['./add-partnership.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    UserAutocompleteComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddPartnershipComponent {
  @ViewChild(UserAutocompleteComponent) userAutocomplete!: UserAutocompleteComponent;
  partnership: StrategicPartnership = {
    name: '',
    description: '',
    participants: []
  };
  participantControl = new FormControl();
  filteredUsers: Observable<any[]>;
  selectedUsers: any[] = [];
  registrationResult: StrategicPartnership | null = null;
  verificationResult: boolean | null = null;
  blockchainRecords: BlockchainRecord[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  formSubmitted = false;
  constructor(
    private partnershipService: PartnershipService,
    protected userSearchService: UserSearchService
  ) {
    this.filteredUsers = this.participantControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): any[] {
    if (typeof value !== 'string') return [];
    const filterValue = value.toLowerCase();

    // In a real app, you would call your user search service here
    // For now, we'll return an empty array and handle search in the template
    return [];
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  getVerificationStatus(): string {
    if (this.verificationResult === true) return 'Verified';
    if (this.verificationResult === false) return 'Verified';
    return 'Pending Verification';
  }

  resetForm(): void {
    this.partnership = {
      name: '',
      description: '',
      participants: []
    };
    this.selectedUsers = [];
    this.participantControl.setValue('');
    this.registrationResult = null;
    this.verificationResult = null;
    this.errorMessage = null;
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (!this.partnership.name || this.partnership.participants.length === 0) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    this.partnershipService.createPartnership(this.partnership).subscribe({
      next: (result) => {
        this.registrationResult = result;
        this.verifyRegistration();
        this.loadBlockchain();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.isLoading = false;
        this.errorMessage = err.status === 0
          ? 'Failed to connect to the server. Please check your connection.'
          : err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  verifyRegistration(): void {
    if (this.registrationResult?.id) {
      this.partnershipService.verifyPartnership(this.registrationResult.id).subscribe({
        next: (isValid) => this.verificationResult = isValid,
        error: (err) => {
          console.error('Verification failed', err);
          this.verificationResult = false;
        }
      });
    }
  }

  loadBlockchain(): void {
    this.partnershipService.getBlockchain().subscribe({
      next: (records) => this.blockchainRecords = records,
      error: (err) => console.error('Failed to load blockchain', err)
    });
  }



  getParticipantNames(): string {
    return this.selectedUsers.map(user => user.name).join(', ');
  }
  removeUser(user: any): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    this.partnership.participants = this.selectedUsers.map(u => u.id);
  }
// In add-partnership.component.ts

  onUsersSelected(users: any[]): void {
    this.selectedUsers = users;
    this.partnership.participants = users.map(u => u.id);


    // Then call clear method when needed
    this.userAutocomplete.clearInput();
  }
}
