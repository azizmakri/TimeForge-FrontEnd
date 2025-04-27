import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal } from './goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = 'http://localhost:8200/timeforge/goals';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  getEstimatedDurationDays(libelle: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/estimerDureeJours/${encodeURIComponent(libelle)}`);
  }

  constructor(private http: HttpClient) {}

  createGoalWithCategories(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/ajouterGoalAvecNouvellesCategories`, payload, this.httpOptions);
  }

  getAllGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/getall`);
  }

  getGoalById(id: string): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}/getGoal/${id}`);
  }

  createGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/ajouterGoal`, goal, this.httpOptions);
  }

  updateGoal(id: string, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/modifierGoal/${id}`, goal);
  }

  deleteGoal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/supprimerGoal/${id}`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>('http://localhost:8200/timeforge/goals/dashboard/stats');
  }
}
