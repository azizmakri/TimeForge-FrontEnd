import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { ChatMessage } from '../../models/chatMessage.model';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient: Client;
  private brokerUrl = 'http://localhost:8300/timeforge/ws'; // e.g., http://localhost:8099/ws
  private connected: boolean = false;

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.brokerUrl),
      reconnectDelay: 5000,
    });
  }

  connect(userId: string, groupChatId: string, onMessage: (msg: any) => void) {
    this.stompClient.onConnect = () => {
      console.log('WebSocket connected.');

      this.connected = true;

      // Subscribe to group chat topic
      this.stompClient.subscribe(`/topic/groupchat.${groupChatId}`, (message: IMessage) => {
        const payload = JSON.parse(message.body);
        onMessage(payload);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker error: ', frame.headers['message']);
      console.error('Details: ', frame.body);
    };

    this.stompClient.activate();
  }

  // Function to send a message through WebSocket
  sendMessage(content: string, groupChatId: string, senderId: string) {
    if (this.stompClient && this.stompClient.connected) {
      const chatMessage: ChatMessage = {
        content: content, // The message content being sent
        groupChatId: groupChatId, // ID of the group chat
        senderId: senderId, // Sender's ID
        type: 'CHAT', // Specify message type if required
        timestamp: new Date() // Optional: Include current timestamp
      };

      // Publish the message to the specified group chat topic
      this.stompClient.publish({
        destination: `/topic/groupchat.${groupChatId}`, // Publish to the relevant topic
        body: JSON.stringify(chatMessage), // Send the message as a JSON string
      });

      console.log('Sent message:', chatMessage); // Log the sent message for debugging
    } else {
      console.error('STOMP client is not connected'); // Handle disconnection
    }
  }
}