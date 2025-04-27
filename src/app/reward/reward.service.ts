import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reward } from './reward.model';

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private apiUrl = 'http://localhost:8200/timeforge/goals';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAllRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.apiUrl}/getAllRewards`);
  }

  getRewardById(id: string): Observable<Reward> {
    return this.http.get<Reward>(`${this.apiUrl}/getReward/${id}`);
  }

  createReward(reward: Reward): Observable<Reward> {
    return this.http.post<Reward>(`${this.apiUrl}/ajouterReward`, reward, this.httpOptions);
  }

  updateReward(id: string, reward: Reward): Observable<Reward> {
    return this.http.put<Reward>(`${this.apiUrl}/modifierReward/${id}`, reward);
  }

  deleteReward(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/supprimerReward/${id}`);
  }
}
