import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Collaboration } from '../models/collaboration.model';
import { CollaborationService } from '../collaboration/collaboration.service';
import { ChatService } from './Service/chat.service';
import { ChatMessage } from '../models/chatMessage.model';
import { Observable } from 'rxjs';
import { User, UserService } from '../user/user.service';
import { WebsocketService } from './Service/websocket.service';
@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{

  Chats$: Observable<ChatMessage[]>;
  collabId: string | null = null;
  collaboration: Collaboration;
  user: User;
  newMessageContent: string = ''; 
  userId: string = ''; 
  constructor(
    private webSocketService:WebsocketService,
    private route: ActivatedRoute,
    private router: Router,
    private collaborationService: CollaborationService,
    private userService: UserService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.collabId = params['id'];
    const user = JSON.parse(localStorage.getItem('user')!);
    this.userId = user?.id;
    this.getCollabById(this.collabId!);

    // Connect WebSocket AFTER collabId and userId are available
    this.webSocketService.connect(this.userId, this.collabId!, (message) => {
      this.onWebSocketMessage(message);
    });
  });

  this.getChatsByCollabId();
}
  messages = [];


  getCollabById(collabId: string): void {
    this.collaborationService.getCollabById(collabId).subscribe(collab => {
      this.collaboration = collab;
      console.log("collab:",this.collaboration)
    });
  }

  getUserById(userId: string): void {
    this.userService.getUserById(userId).subscribe(user => {
      this.user = user;
      console.log("user:",this.user)
    });
  }
  onWebSocketMessage(message: any) {
    console.log('New WebSocket message:', message);
  
    this.messages.push({
      senderId: message.senderId,
      sender: message.senderId === this.userId ? 'Me' : 'Other',
      text: message.content,
      type: message.senderId === this.userId ? 'sent' : 'received'
    });
  
    // Later you can improve fetching "other" user's name if needed
  }

  getChatsByCollabId(): void {
    if (this.collabId) {
      this.chatService.getChatsbByCollabId(this.collabId).subscribe({
        next: (chats) => {
          console.log('Chats:', chats);
  
          // First, initialize messages with senderId
          this.messages = chats.map(chat => ({
            senderId: chat.senderId,
            sender: chat.senderId, // temporarily until we fetch names
            text: chat.content,
            type: chat.senderId === this.userId ? 'sent' : 'received'
          }));
  
          // Now, get unique senderIds
          const uniqueSenderIds = [...new Set(chats.map(chat => chat.senderId))];
  
          // Fetch user names for each unique senderId
          uniqueSenderIds.forEach(senderId => {
            if (senderId === this.userId) return; // Skip if it's yourself ("Me")
  
            this.userService.getUserById(senderId).subscribe(user => {
              // Now update all messages that have this senderId
              this.messages.forEach(message => {
                if (message.sender === senderId) {
                  message.sender = user.name;
                }
              });
            });
          });
  
          // Finally, update your name
          this.messages.forEach(message => {
            if (message.sender === this.userId) {
              message.sender = 'Me';
            }
          });
  
        },
        error: (err) => {
          console.error('Error fetching chats:', err);
        }
      });
    }
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim()) {
      return; // don't send empty message
    }

    const chatMessage: ChatMessage = {
      content: this.newMessageContent,
      senderId: this.userId,
      groupChatId: this.collabId!
    };

    this.chatService.addChat(chatMessage, this.collabId!, this.userId).subscribe({
      next: (res) => {
        console.log('Message sent successfully:', res);
        // optionally add it to the messages array to update UI instantly
        //this.messages.push({ sender: 'Me', text: this.newMessageContent, type: 'sent' });
        this.webSocketService.sendMessage(chatMessage.content,this.collabId!,this.userId);
        this.newMessageContent = ''; // clear input
      },
      error: (err) => {
        console.error('Error sending message:', err);
      }
    });
  }
}

