import { Task } from './task.model';

export interface Column {
  _id: string;
  name: string;
  order: number;
  board:string;
  tasks: Task[];

 
}
