// pdf.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private http: HttpClient) {}

  downloadPartnershipPdf(partnershipId: string) {
    return this.http.get(`http://localhost:8100/timeforge/api/partnerships/${partnershipId}/pdf`, {
      responseType: 'arraybuffer'
    });
  }
}
