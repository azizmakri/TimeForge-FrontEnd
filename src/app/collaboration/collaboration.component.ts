import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { CollaborationService } from './collaboration.service';
import { Collaboration } from '../models/collaboration.model';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { User, UserService } from '../user/user.service';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';

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
  collaborations$: Observable<Collaboration[]>;
  membres$: Observable<User[]>;
  filteredMembres$: Observable<User[]>;
  selectedMembres: User[] = [];
  collaboration: Collaboration;
  submitted: boolean = true;
  searchControl: FormControl = new FormControl();

  get selectedMembresNames(): string {
    return this.selectedMembres.map(m => m.name).join(', ');
  }
  newCollaboration: Collaboration = {
    id: '',
    title: '',
    userIds: [],
//    messages: [],
  };

  constructor(private formBuilder: FormBuilder, private userServices: UserService,private collaborationService: CollaborationService,private router: Router) {
    this.membres$ = new Observable<User[]>();
    this.filteredMembres$ = new Observable<User[]>();
  
  }
  showAnimation = true;  // To control if the animation is visible

  ngOnInit(): void {
    this.loadCollaborations();
    // Hide the animation after 5 seconds and show the workflow content
    setTimeout(() => {
      this.showAnimation = false;
    }, 6000);



    this.membres$ = this.userServices.findAllUsers();
    this.initForm();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => this.filterMemebres(term));
    this.filterMemebres('');
  }

  get userId(): string | null {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      try {
        return JSON.parse(userJSON)?.id ?? null;
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        return null;
      }
    }
    return null;
  }

  filterMemebres(searchTerm: string): void {
    this.filteredMembres$ = this.membres$.pipe(
      map(membres => {
        const filtered = membres.filter(membre =>
          (membre.name && membre.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          this.selectedMembres.some(s => s.id === membre.id)
        );
        return filtered;
      })
    );
  }
  myForm: any;

  initForm() {
    this.myForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      userIds: [[]]
    });
  }

  onMemberSelect(membre: User): void {
    if (!this.selectedMembres.some(m => m.id === membre.id)) {
      this.selectedMembres.push(membre);
    }
  
    // Update userIds in the model
    this.newCollaboration.userIds = this.selectedMembres.map(m => m.id);
  
    // Reset search
    this.filterMemebres('');
    this.searchControl.setValue('');
  }

  // Load all collaborations
  loadCollaborations(): void {
    const userId = this.userId;
  
    if (!userId) {
      console.error('No user ID found in localStorage.');
      return;
    }
  
    this.collaborations$ = this.collaborationService.getCollaborationsByUser(userId);
  }
  

  addCollab(): void {
    this.submitted = true;
  
    if (this.myForm.valid) {
      const collaboration: Collaboration = {
        title: this.myForm.value.title,
        userIds: this.myForm.value.userIds
      };
  
      console.log('Sending collaboration:', collaboration);
  
      this.collaborationService.addCollab(collaboration).subscribe(
        () => {
          console.log('Collaboration created!');
          this.myForm.reset();
          this.selectedMembres = [];
          this.filterMemebres('');
          this.loadCollaborations();
        },
        (error) => {
          console.error('Error creating collaboration:', error);
        }
      );
    }
  }
  
  getCollabById(id: string): void {
    console.log('Collab ID:', id);
    this.collaborationService.getCollabById(id).subscribe(collab => {
      console.log("Returned collaboration:", collab);
        this.router.navigate(['/chat', id.toString()]);
    });
  }

  // Delete a collaboration
  deleteCollaboration(collaborationId: string | undefined): void {
    if (!collaborationId) {
      console.error('Invalid collaboration ID.');
      return;
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'This collaboration will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.collaborationService.deleteCollaboration(collaborationId).subscribe(
          () => {
            Swal.fire(
              'Deleted!',
              'Your collaboration has been deleted.',
              'success'
            );
            this.loadCollaborations(); // Refresh the list
          },
          (error) => {
            console.error('Error deleting collaboration:', error);
            Swal.fire(
              'Error!',
              'Something went wrong while deleting.',
              'error'
            );
          }
        );
      }
    });
  }

  // Reset the form
  resetForm(): void {
    this.newCollaboration = {
      title: '',
      userIds: [],
//      messages: [],
    };
  }
}
