import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workspace } from './workspace.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private baseUrl = 'http://localhost:8500/timeforge/workspaces';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${this.baseUrl}/getAllWorkspaces`);
  }


  getById(id: string): Observable<Workspace> {
    return this.http.get<Workspace>(`${this.baseUrl}/getWorkspaceById/${id}`);
  }

  create(workspace: Workspace): Observable<Workspace> {
    return this.http.post<Workspace>(`${this.baseUrl}/create`, workspace, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  update(id: number, workspace: Workspace): Observable<Workspace> {
    return this.http.put<Workspace>(`${this.baseUrl}/update/${id}`, workspace);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
