import { Column } from './column.model';

export interface Board {
  _id?:string;
  title: string;
  description:string;
  columns: Column[];

  }