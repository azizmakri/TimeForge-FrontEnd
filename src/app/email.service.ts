import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'http://localhost:8100/timeforge/api/email/send';  // URL to the email microservice

  constructor(private http: HttpClient) {}

  sendEmail(emailData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Get JWT token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Attach the token
    });

    return this.http.post<any>(this.apiUrl, emailData, { headers });
  }
}
