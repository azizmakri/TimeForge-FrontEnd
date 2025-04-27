import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Project } from '../models/project.model';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:8400/timeforge/projects';

   constructor(private http: HttpClient) {}


   getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}`); // Change /getAllProjects en /projects
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`); // Change /getProjectById/${id} en /${id}
  }


   private httpOptions = {
     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   };

   createProject(project: Project): Observable<Project> {
     return this.http.post<Project>(`${this.apiUrl}/create`, project, this.httpOptions);
   }

   updateProject(id: string | undefined, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/modify-project`, project); // Changer la route
  }


   deleteProject(id: string | undefined): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
   }

  getProjectDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard-stats`);
  }


}
