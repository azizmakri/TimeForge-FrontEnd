export interface Task {
  _id?: string;
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  dueDate: Date;
  columnId: string;
  history: string[]; // Ajout du champ history
}
