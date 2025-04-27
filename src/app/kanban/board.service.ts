import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiUrl = 'http://localhost:8400/timeforge/boards';
   
    constructor(private http: HttpClient) { }
    private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    // Obtenir toutes les boards
    getAllBoards(): Observable<Board[]> {
      return this.http.get<Board[]>(this.apiUrl); 
    }
  
    // Obtenir une board par son ID
    getBoardById(id: string): Observable<Board> {
      return this.http.get<Board>(`${this.apiUrl}/${id}`); // Utilisation de l'ID dans l'URL
    }
 
    // Créer une nouvelle board
    createBoard(board: Board): Observable<Board> {
      return this.http.post<Board>(`${this.apiUrl}/create`, board,this.httpOptions); // Ajout de /create pour correspondre à la route Spring
    }
  
    // Mettre à jour une board existante
    updateBoard(board: Board): Observable<Board> {
      return this.http.put<Board>(`${this.apiUrl}/modify-board`, board, this.httpOptions); // Mettre à jour via la route /modify-board
    }
  
    // Supprimer une board par son ID
    deleteBoard(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }
  
