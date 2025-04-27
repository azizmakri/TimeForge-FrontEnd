import {Reward} from '../reward/reward.model';

export interface Goal {
  goal_id?: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  rewards?: Reward[];
}
