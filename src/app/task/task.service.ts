import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task.model';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
 private apiUrl = 'http://localhost:8400/timeforge/tasks';
 
   constructor(private http: HttpClient) {}
   private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

 
getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}`); // Change /getAllTasks en /tasks
  }
  
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`); // Change /getTaskById/${id} en /${id}
  }

 
   createTask(task: Task): Observable<Task> {
     return this.http.post<Task>(`${this.apiUrl}/create`, task);
   }
 
   updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/update/${task._id}`, task);
  }
 
   deleteTask(id: string | undefined): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
   getTasksByColumnId(columnId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/column/${columnId}`);
  }
  // searchTasks(filters: {
  //   name?: string;
  //   priority?: string;
  //   assignedToId?: string;
  //   projectId?: string;
  // }): Observable<Task[]> {
  //   // Nettoie les paramètres avant envoi
  //   const cleanedFilters = Object.fromEntries(
  //     Object.entries(filters).filter(([_, v]) => !!v)
  //   );
    
  //   const params = new HttpParams({ fromObject: cleanedFilters });
  //   return this.http.get<Task[]>(`${this.apiUrl}/search`, { params });
  // }
}
