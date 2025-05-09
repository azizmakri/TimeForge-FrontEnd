
  export class NotificationModel {
    id?: string;
    recipient: string;        // ID of the user who should receive the notification
    sender: string;           // ID of the user who sent the message
    content: string;          // The content of the notification
    timestamp?: Date;          // When the notification was created
    chatContextId: string;    // ID of the group or user (context dependent)
    chatType?: string;       // Either GROUP or PRIVATE
  }