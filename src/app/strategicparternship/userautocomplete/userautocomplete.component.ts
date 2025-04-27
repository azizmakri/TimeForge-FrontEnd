import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserSearchService } from '../usersearch.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatFormField, MatInput} from '@angular/material/input';
import {AsyncPipe, NgForOf} from '@angular/common';
import {MatChipGrid, MatChipInput, MatChipRow} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-user-autocomplete',
  templateUrl: './userautocomplete.component.html',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatAutocomplete,
    MatOption,
    NgForOf,
    MatAutocompleteTrigger,
    AsyncPipe,
    MatChipInput,
    MatChipRow,
    MatChipGrid
  ],
  styleUrls: ['./userautocomplete.component.css'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserAutocompleteComponent {
  @Input() label: string = 'Participants';
  @Output() usersSelected = new EventEmitter<any[]>();

  searchControl = new FormControl();
  filteredUsers: Observable<any[]>;
  selectedUsers: any[] = [];
  defaultUserImage = 'assets/images/default-user.png';

  constructor(
    private userSearchService: UserSearchService,
    private sanitizer: DomSanitizer
  ) {
    this.filteredUsers = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (typeof term === 'string') {
          return this.userSearchService.searchUsers(term);
        }
        return [];
      })
    );
  }

  getUserPhotoUrl(user: any): string {
    if (user?.photoBase64 && user?.photoContentType) {
      return `data:${user.photoContentType};base64,${user.photoBase64}`;
    }
    return this.defaultUserImage;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultUserImage;
    imgElement.onerror = null; // Prevent infinite loop if default image fails
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  onOptionSelected(event: any): void {
    const user = event.option.value;
    if (!this.selectedUsers.some(u => u.id === user.id)) {
      this.selectedUsers.push(user);
      this.usersSelected.emit(this.selectedUsers); // <== Emit full users
    }
    this.searchControl.setValue('', { emitEvent: false });

    // Manually trigger the input clearing (for some Angular Material versions)
    const input = event.source._elementRef.nativeElement.querySelector('input');
    if (input) {
      input.value = '';
    }
  }

  removeUser(user: any): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    this.usersSelected.emit(this.selectedUsers); // <== Same here
  }
  add(event: any): void {
    // Only add if we have a valid input
    const input = event.input;
    const value = event.value;

    // Add our user if it doesn't exist already
    if ((value || '').trim()) {
      // You might want to search for the user here
      // For now, we'll just prevent adding raw text
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.searchControl.setValue(null);
  }
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  clearInput(): void {
    this.searchControl.setValue('', { emitEvent: false });

    // If you need to manually clear the input element
    const inputElement = document.querySelector('.example-chip-list input');
    if (inputElement) {
      (inputElement as HTMLInputElement).value = '';
    }
  }
}
