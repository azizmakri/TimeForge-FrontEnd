// src/app/services/strategicpartnership.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

export interface StrategicPartnership {
  id?: string;
  name: string;
  description: string;
  participants: string[];
  creationDate?: Date;
  blockchainHash?: string;
  blockchainTimestamp?: Date;
}

export interface BlockchainRecord {
  hash: string;
  previousHash: string;
  timestamp: Date;
  partnershipId: string;
  dataHash: string;
  nonce: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartnershipService {
  private baseUrl = 'http://localhost:8100/timeforge/api/partnerships';
  private blockchainUrl = 'http://localhost:8100/timeforge/api/blockchain';

  constructor(private http: HttpClient) { }

  // Add these methods if not already present
  getAllPartnerships(): Observable<StrategicPartnership[]> {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      return throwError(() => new Error('Please login to access partnerships'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<StrategicPartnership[]>(this.baseUrl, { headers })
    .pipe(
      catchError(err => {
        console.error('API Error:', err);
        return throwError(() => new Error('Failed to load partnerships'));
      })
    );
  }

  getPartnership(id: string): Observable<StrategicPartnership> {
    return this.http.get<StrategicPartnership>(`${this.baseUrl}/${id}`);
  }

  createPartnership(partnership: StrategicPartnership): Observable<StrategicPartnership> {
    return this.http.post<StrategicPartnership>(this.baseUrl, partnership);
  }

  verifyPartnership(id: string): Observable<boolean> {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      return throwError(() => new Error('Please login to access verification'));
    }2

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<boolean>(`http://localhost:8100/timeforge/api/partnerships/${id}/verify`, { headers })
    .pipe(
      catchError(err => {
        console.error('Verification failed:', err);
        return throwError(() => new Error('Failed to verify partnership'));
      })
    );
  }


  deletePartnership(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBlockchain(): Observable<BlockchainRecord[]> {
    return this.http.get<BlockchainRecord[]>(this.blockchainUrl);
  }
  getNamesByIds(ids: string[]): Observable<{ [id: string]: string }> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Send as plain array in body
    return this.http.post<{ [id: string]: string }>(
      `${this.baseUrl}/names`,
      ids,  // Send array directly
      { headers }
    ).pipe(
      catchError(err => {
        console.error('Failed to load participant names:', err);
        return throwError(() => new Error('Failed to load participant names'));
      })
    );
  }
  updatePartnership(id: string, partnership: StrategicPartnership): Observable<StrategicPartnership> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<StrategicPartnership>(`${this.baseUrl}/${id}`, partnership, { headers }).pipe(
      catchError(err => {
        console.error('Failed to update partnership:', err);
        return throwError(() => new Error('Failed to update partnership'));
      })
    );
  }
  getDashboardStats(): Observable<any> {
    return this.http.get<any>('http://localhost:8100/timeforge/api/partnerships/stats');
  }

}
