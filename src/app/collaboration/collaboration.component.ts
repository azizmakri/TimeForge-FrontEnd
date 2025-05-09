import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { CollaborationService } from './collaboration.service';
import { Collaboration } from '../models/collaboration.model';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { User, UserService } from '../user/user.service';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { first } from 'rxjs';


@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    MatSelectModule,
    NgForOf,
    MatFormFieldModule,    // ✅ Required for mat-form-field
    MatInputModule, 
    NgIf,
    AsyncPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CollaborationComponent implements OnInit {
  collaborations$!: Observable<Collaboration[]>;
  membres$!: Observable<User[]>;
  filteredMembres$!: Observable<User[]>;
  selectedMembres: User[] = [];
  myForm!: FormGroup;
  userId!: string;

  searchControl: FormControl = new FormControl();
  showAnimation = true;

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserService,
    private collaborationService: CollaborationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Step 1: Load and store userId
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      console.error('User not found in localStorage');
      return;
    }

    try {
      const user = JSON.parse(userJSON);
      this.userId = user?.id;
      if (!this.userId) throw new Error('Invalid user ID');
    } catch (e) {
      console.error('Failed to parse user ID from localStorage', e);
      return;
    }

    // Step 2: Init form with current user ID in userIds
    this.myForm = this.formBuilder.group({
      title: ['', Validators.required],
      userIds: [[this.userId], Validators.required]
    });

    // Step 3: Load and filter members
    this.membres$ = this.userServices.findAllUsers().pipe(
      map(users => users.filter(user => user.id !== this.userId))
    );

    // Step 4: Filtering logic with search
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => this.filterMemebres(term));

    this.filterMemebres('');
    this.loadCollaborations();

    // Hide animation after delay
    setTimeout(() => {
      this.showAnimation = false;
    }, 6000);
  }

  filterMemebres(searchTerm: string): void {
    this.filteredMembres$ = this.membres$.pipe(
      map(membres =>
        membres.filter(membre =>
          (membre.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          this.selectedMembres.some(s => s.id === membre.id)
        )
      )
    );
  }

  onMemberSelect(membre: User): void {
    if (!this.selectedMembres.some(m => m.id === membre.id)) {
      this.selectedMembres.push(membre);
    }

    // Update form with new userIds + always include yourself
    const userIds = Array.from(new Set([this.userId, ...this.selectedMembres.map(m => m.id)]));
    this.myForm.patchValue({ userIds });

    // Reset search
    this.searchControl.setValue('');
    this.filterMemebres('');
  }

  loadCollaborations(): void {
    this.collaborations$ = this.collaborationService.getCollaborationsByUser(this.userId);
  }

  addCollab(): void {
    if (this.myForm.invalid) return;
  
    const payload: Collaboration = {
      title: this.myForm.value.title,
      userIds: Array.from(new Set([this.userId, ...this.myForm.value.userIds]))
    };
  
    this.collaborationService.addCollab(payload).subscribe(() => {
      // Reset form
      this.myForm.reset({ title: '', userIds: [this.userId] });
      this.selectedMembres = [];
      this.filterMemebres('');
      this.loadCollaborations();
  
      // ✅ Success alert
      Swal.fire({
        icon: 'success',
        title: 'Collaboration Created!',
        text: 'Your new collaboration has been successfully added.',
        confirmButtonColor: '#3085d6'
      });
    }, error => {
      console.error('Error creating collaboration:', error);
      const errorMessage = error?.error?.message || 'Something went wrong while creating the collaboration.';
      
      // ❌ Error alert
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create Collaboration',
        text: errorMessage,
        confirmButtonColor: '#d33'
      });
    });
  }

  addPrivateMEssage(memberId: string): void {
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      Swal.fire('Error', 'Current user not found', 'error');
      return;
    }
  
    const currentUser = JSON.parse(userJSON);
    const userId1 = currentUser.id;
    const userName = currentUser.name;
  
    // Use first() to complete the observable after first emission
    this.membres$.pipe(first()).subscribe(members => {
      const member = members.find(m => m.id === memberId);
      if (!member) {
        Swal.fire('Error', 'Recipient not found', 'error');
        return;
      }
  
      const userId2 = member.id;
      const title = `${userName}_${member.name}`;
  
      const payload = { userId1, userId2, title };
  
      this.collaborationService.privateMessage(payload).subscribe({
        next: (chatId: string) => {this.getCollabById(chatId);},
        error: error => {
          console.error('Error creating private chat:', error);
          const msg = error?.error?.message || 'Failed to create private chat.';
          Swal.fire('Error', msg, 'error');
        }
      });
    });
  }

  getCollabById(id: string): void {
    this.collaborationService.getCollabById(id).subscribe(() => {
      this.router.navigate(['/chat', id]);
    });
  }

  deleteCollaboration(collaborationId: string | undefined): void {
    if (!collaborationId) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'This collaboration will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.collaborationService.deleteCollaboration(collaborationId).subscribe(() => {
          Swal.fire('Deleted!', 'Your collaboration has been deleted.', 'success');
          this.loadCollaborations();
        }, err => {
          console.error('Error deleting:', err);
          Swal.fire('Error!', 'Something went wrong.', 'error');
        });
      }
    });
  }
}