import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Workflow} from './workflow.model';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})


export class WorkflowService {
  private apiUrl = 'http://localhost:8500/timeforge/workflows';

  constructor(private http: HttpClient) {}


  getAllWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${this.apiUrl}/getAllWorkflows`);
  }

  getWorkflowById(id: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/getWorkflowById/${id}`);
  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  createWorkflow(formData: FormData): Observable<any> {
    const url = 'http://localhost:8500/timeforge/workflows/create';
    return this.http.post(url, formData);  // Utilisez .post sans spécifier Content-Type
  }


  updateWorkflow(id: string | undefined, formData: FormData): Observable<Workflow> {
    const url = `http://localhost:8500/timeforge/workflows/update/${id}`;
    return this.http.put<Workflow>(url, formData);
  }



  deleteWorkflow(id: string | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  uploadFile(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/files/upload`, formData);
  }

  downloadFile(workflowId: string | undefined, fileName: string | undefined): Observable<Blob> {
    const url = `${this.apiUrl}/${workflowId}/files/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }


}
