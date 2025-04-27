import { Categorie } from './categorie.model';

export interface Goal {
  goal_id?: string;
  title: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  categories?: Categorie[];
}
