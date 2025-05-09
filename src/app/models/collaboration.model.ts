export class Collaboration {
  
  id?: string;
  title: string;
  userIds: String[];
  chatType?:string;
  
//  messages: Message[];
}

export class PrivateMessage {
  title: string;
  userId1: string;
  userId2: string;
}