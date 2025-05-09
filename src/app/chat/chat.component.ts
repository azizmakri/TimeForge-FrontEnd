import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Collaboration } from '../models/collaboration.model';
import { CollaborationService } from '../collaboration/collaboration.service';
import { ChatService } from './Service/chat.service';
import { ChatMessage } from '../models/chatMessage.model';
import { map, Observable } from 'rxjs';
import { User, UserService } from '../user/user.service';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { WebsocketService } from './Service/websocket.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked{
  @ViewChild('chatBody') private chatBody!: ElementRef;
  Chats$: Observable<ChatMessage[]>;
  collabId: string | null = null;
  collaboration: Collaboration = { title: '', userIds: [], chatType: '' };

  user: User;
  newMessageContent: string = ''; 
  selectedMembres: User[] = [];
  userId: string = ''; 
  submitted: boolean = true;

  
  membres$: Observable<User[]>;
  filteredMembres$: Observable<User[]>;
  constructor(
    private formBuilder: FormBuilder,
    private webSocketService:WebsocketService,
    private route: ActivatedRoute,
    private router: Router,
    private collaborationService: CollaborationService,
    private userService: UserService,
    private chatService: ChatService
  ) {
    this.membres$ = new Observable<User[]>();
    this.filteredMembres$ = new Observable<User[]>();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  ngOnInit(): void {
    if (!window.location.hash.includes('reloaded')) {
      setTimeout(() => {
        window.location.href = window.location.href + '#reloaded';
        window.location.reload();
      }, 100);
      return;
    }
  
    // Proceed with normal init only after reload
    this.route.params.subscribe(params => {
      this.collabId = params['id'];
      const user = JSON.parse(localStorage.getItem('user')!);
      this.userId = user?.id;
      this.getCollabById(this.collabId!);
  
      this.webSocketService.connect(this.userId, this.collabId!, (message) => {
        this.onWebSocketMessage(message);
      });
    });
  
    this.getChatsByCollabId();
    this.initForm();
    this.refreshAvailableMembers();
  }
  
  messages = [];


  filterMemebres(searchTerm: string): void {
    this.filteredMembres$ = this.membres$.pipe(
      map(membres => {
        return membres.filter(membre =>
          membre.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          this.selectedMembres.some(s => s.id === membre.id)
        );
      })
    );
  }
  
    myForm: any;
    
    initForm() {
      this.myForm = this.formBuilder.group({
        userId: ['', Validators.required]
      });
    }
    

    addUsersToChat(): void {
      this.submitted = true;
    
      if (this.myForm.valid) {
        const selectedUserId = this.myForm.value.userId;
    
        this.chatService.addUserToChat(this.collabId, selectedUserId).subscribe(
          () => {
            this.userService.getUserById(selectedUserId).subscribe(user => {
              const systemMessage: ChatMessage = {
                content: `${user.name} has joined the chat.`,
                senderId: null,
                groupChatId: this.collabId!
              };
    
              this.chatService.addChat(systemMessage, this.collabId!, null).subscribe(() => {
                this.webSocketService.sendMessage(systemMessage.content, this.collabId!, null);
              });
            });
    
            // ✅ Add the user ID to the in-memory list
            if (!this.collaboration.userIds.includes(selectedUserId)) {
              this.collaboration.userIds.push(selectedUserId);
            }
    
            Swal.fire({
              icon: 'success',
              title: 'User Added',
              text: 'The user was successfully added to the group chat!',
              timer: 2000,
              showConfirmButton: false
            });
    
            this.myForm.reset();
            this.filterMemebres('');
            this.refreshAvailableMembers(); // Now works correctly
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add user to chat. Please try again.'
            });
            console.error('Error adding user to chat:', error);
          }
        );
      }
    }
    
    
    
  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll failed:', err);
    }
  }
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
      sender: message.senderId === null
        ? 'System'
        : message.senderId === this.userId
          ? 'Me'
          : 'Other',
      text: message.content,
      type: message.senderId === null
        ? 'system'
        : message.senderId === this.userId
          ? 'sent'
          : 'received'
    });
    this.scrollToBottom();
    // Later you can improve fetching "other" user's name if needed
  }

  getChatsByCollabId(): void {
    if (this.collabId) {
      this.chatService.getChatsbByCollabId(this.collabId).subscribe({
        next: (chats) => {
          console.log('Chats:', chats);
  
          this.messages = chats.map(chat => ({
            senderId: chat.senderId,
            sender: chat.senderId,
            text: chat.content,
            type: chat.senderId === null || chat.senderId === 'null'
              ? 'system'
              : chat.senderId === this.userId
                ? 'sent'
                : 'received'
          }));
  
          // Get unique sender IDs, excluding null, 'null', and current user
          const uniqueSenderIds = [
            ...new Set(chats.map(chat => chat.senderId))
          ].filter(id => id && id !== this.userId && id !== 'null');
  
          // Fetch and assign user names
          uniqueSenderIds.forEach(senderId => {
            this.userService.getUserById(senderId).subscribe(user => {
              this.messages.forEach(message => {
                if (message.sender === senderId) {
                  message.sender = user.name;
                }
              });
            });
          });
  
          // Label current user's messages
          this.messages.forEach(message => {
            if (message.sender === this.userId) {
              message.sender = 'Me';
            } else if (message.sender === null || message.sender === 'null') {
              message.sender = 'System';
            }
          });
  
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('Error fetching chats:', err);
        }
      });
    }
  }

  refreshAvailableMembers(): void {
    this.userService.findAllUsers().subscribe(users => {
      this.membres$ = new Observable(observer => {
        const filtered = users.filter(u => !this.collaboration?.userIds.includes(u.id));
        observer.next(filtered);
      });
      this.filterMemebres('');
    });
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

