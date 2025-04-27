// user-search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserSearchService {
  private apiUrl = 'http://localhost:8100/timeforge/users'; // Update this to your actual API endpoint

  constructor(private http: HttpClient) { }

  searchUsers(term: string): Observable<any[]> {
    if (!term || term.length < 2) {
      return of([]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${encodeURIComponent(term)}`).pipe(
      catchError(err => {
        console.error('Search failed:', err);
        return of([]); // Return empty array on error
      })
    );
  }
  getUsersByIds(ids: string[]): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-ids?ids=${ids.join(',')}`);
  }
}
