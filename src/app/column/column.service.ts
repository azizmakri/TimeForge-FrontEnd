import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from '../models/column.model'; // Assure-toi que ce modèle existe

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private apiUrl = 'http://localhost:8400/timeforge/columns';

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getAllColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.apiUrl}`);
  }

  getColumnById(id: string): Observable<Column> {
    return this.http.get<Column>(`${this.apiUrl}/${id}`);
  }

  createColumn(column: Column): Observable<Column> {
    return this.http.post<Column>(`${this.apiUrl}/create`, column);
  }

  saveListColumn(column: Column[]): Observable<Column> {
    return this.http.post<Column>(`${this.apiUrl}/createListColumn`, column);
  }

  updateColumn( column: Column): Observable<Column> {
    return this.http.put<Column>(`${this.apiUrl}/modify-column`, column, this.httpOptions);
  }
  removeBoardFromColumn( column: Column): Observable<Column> {
    return this.http.put<Column>(`${this.apiUrl}/deleteBoard`, column, this.httpOptions);
  }
  deleteColumn(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getColumnByIdBoard(id: string): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.apiUrl}/getAll/${id}`);
  }

  addTaskToColumn( column: Column): Observable<Column> {
    return this.http.put<Column>(`${this.apiUrl}/addTaskToColumn`, column, this.httpOptions);
  }

  moveTask(taskId: string, fromColumnId: string, toColumnId: string): Observable<Column> {
    return this.http.put<Column>(`${this.apiUrl}/move-task`, null, {
      params: {
        taskId : taskId,
        fromColumnId : fromColumnId,
        toColumnId : toColumnId
      }
    });
  }
  
}
