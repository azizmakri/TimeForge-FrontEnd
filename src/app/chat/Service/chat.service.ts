import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../models/chatMessage.model';
import { HttpClient } from '@angular/common/http';
import { User } from '../../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
private apiUrl = 'http://localhost:8300/timeforge/groupchat'; // Base URL for collaborations

  constructor(private http: HttpClient) {}

  getChatsbByCollabId(id: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/ChatMessagesByGroupChat/${id}`);
  }


 
  addChat(collab: ChatMessage,groupChatId:string,senderId:string): Observable<any> {
      return this.http.post(`${this.apiUrl}/sendMessage/${groupChatId}/${senderId}`, collab);
    }
    getAllUsersExceptInGroupChat(groupChatId): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiUrl}/usersNotInGroupChat/${groupChatId}`);
    }

    addUserToChat(groupChatId: string, userId: string): Observable<any> {
      return this.http.post(
        `${this.apiUrl}/addUserToGroupChat/${groupChatId}`,
        userId,
        { headers: { 'Content-Type': 'text/plain' } }
      );
    }
}
