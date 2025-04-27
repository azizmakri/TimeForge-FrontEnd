import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = 'http://localhost:8500/timeforge/files';

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      responseType: 'text'
    });
  }

  download(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/get/${fileName}`, {
      responseType: 'blob'
    });
  }
}
