import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { NotificationModel } from '../../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private stompClient: Client;
  private brokerUrl = 'http://localhost:8300/timeforge/ws';
  private connected = false;

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.brokerUrl),
      reconnectDelay: 5000,
    });
  }

  connect(userId: string, onNotification: (notification: NotificationModel) => void): void {
    this.stompClient.onConnect = () => {
      console.log('📬 Notification WebSocket connected.');
      this.connected = true;

      // Subscribe to the user's personal notification topic
      this.subscribeToNotifications(userId, onNotification);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('🔴 Notification Broker error:', frame.headers['message']);
      console.error('Details:', frame.body);
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }

  /**
   * Subscribe to real-time notifications for a user.
   */
  subscribeToNotifications(userId: string, onNotification: (notification: NotificationModel) => void): void {
    if (!this.connected) {
      console.warn('STOMP client not connected yet. Connect first.');
      return;
    }

    this.stompClient.subscribe(`/topic/notification.${userId}`, (message: IMessage) => {
      const notification: NotificationModel = JSON.parse(message.body);
      console.log('🔔 Received notification:', notification);
      onNotification(notification);
    });
  }
}
