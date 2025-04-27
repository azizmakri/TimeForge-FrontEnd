import { User } from "./collaboration.model";

export interface Message {
    messageId: string;
    content: string;
    sender: User;
    sentAt: Date;
  }
  