import { Injectable } from '@angular/core';
import { IMessage, Stomp, StompSubscription } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { ChatMessage } from '../../models/chatMessage.model';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient: Client | null = null; // STOMP client instance
  private socketUrl = 'http://localhost:8300/ws'; // WebSocket endpoint (modify as needed)
  public messages: Subject<ChatMessage>; // Subject to emit messages for subscribers

  constructor() {
    this.messages = new Subject<ChatMessage>(); // Initialize the Subject to broadcast messages
  }

  // Establish connection with the WebSocket server and subscribe to the specified group chat
  connect() {
    const socket = new SockJS(this.socketUrl); // Create a SockJS connection
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => { console.log('STOMP: ' + str); },
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        this.subscribeToGroupChat(); // Subscribe to the specified group chat topic
      },
      onDisconnect: (frame) => {
        console.log('Disconnected: ' + frame);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Details: ' + frame.body);
      }
    });

    this.stompClient.activate(); // Activate the STOMP client
  }

  // Subscribe to the group chat topic
  private subscribeToGroupChat() {
    if (this.stompClient) {
      const topic = `/topic/public`; // Dynamic subscription based on group chat ID
      this.stompClient.subscribe(topic, (message: IMessage) => {
        this.handleIncomingMessage(message); // Handle incoming messages
      });
      console.log(`Subscribed to ${topic}`); // Log subscription
    }
  }

  // Handle incoming messages from the WebSocket
  private handleIncomingMessage(message: IMessage) {
    const chatMessage: ChatMessage = JSON.parse(message.body); // Deserialize incoming message
    this.messages.next(chatMessage); // Emit the message to subscribers
    console.log('Received message:', chatMessage); // Log the received message
  }

  // Send a message through WebSocket
  sendMessage(content: string, groupChatId: string, senderId: string) {
    if (this.stompClient && this.stompClient.connected) {
      const chatMessage: ChatMessage = {
        content: content,
        groupChatId: groupChatId,
        senderId: senderId,
        type: 'CHAT', // Specify message type if necessary
        timestamp: new Date() // Optional: Include timestamp
      };

      this.stompClient.publish({
        destination: `/topic/${groupChatId}`, // Publish to the specific group chat topic
        body: JSON.stringify(chatMessage), // Send the message as a JSON string
      });

      console.log('Sent message:', chatMessage); // Log sent message
    } else {
      console.error('STOMP client is not connected.'); // Log error if connection is not established
    }
  }

  // Disconnect from the WebSocket server
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate(); // Deactivate the STOMP client
      console.log('Disconnected from WebSocket'); // Log disconnection
    }
  }
}