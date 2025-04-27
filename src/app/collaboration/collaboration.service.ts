import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collaboration } from '../models/collaboration.model';
import {Message} from 'primeng/message';
import { ChatMessage } from '../models/chatMessage.model';


@Injectable({
  providedIn: 'root',
})
export class CollaborationService {
  private apiUrl = 'http://localhost:8300/timeforge/groupchat'; // Base URL for collaborations

  constructor(private http: HttpClient) {}

 
  addCollab(collab: Collaboration): Observable<any> {
    return this.http.post(`${this.apiUrl}/createGroupChat`, collab, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // Fetch all collaborations
  findAllCollaborations(): Observable<Collaboration[]> {
    return this.http.get<Collaboration[]>(`${this.apiUrl}`);
  }
  getCollaborationsByUser(userId: string): Observable<Collaboration[]> {
    return this.http.get<Collaboration[]>(`${this.apiUrl}/GroupChatsByUserId/${userId}`);
  }

  // Search collaborations by chat title
  findByChatTitle(chatTitle: string): Observable<Collaboration[]> {
    return this.http.get<Collaboration[]>(`${this.apiUrl}/search/title`, {
      params: { chatTitle },
    });
  }

  // Search collaborations by participant ID
  findByParticipant(userId: string): Observable<Collaboration[]> {
    return this.http.get<Collaboration[]>(`${this.apiUrl}/search/participant`, {
      params: { userId },
    });
  }

  // Add a message to a collaboration
  addMessageToCollaboration(
    collaborationId: string,
    message: Message
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${collaborationId}/messages`,
      message,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  // Update a collaboration
  updateCollaboration(
    collaborationId: string,
    updatedCollaboration: Collaboration
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/update/${collaborationId}`,
      updatedCollaboration,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }
  getCollabById(id: string): Observable<Collaboration> {
    return this.http.get<Collaboration>(`${this.apiUrl}/getGroupChatById/${id}`);
  }


 
  // Delete a collaboration
  deleteCollaboration(collaborationId: string | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteGroupChat/${collaborationId}`);
  }
}
