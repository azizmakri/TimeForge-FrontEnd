export interface Project {
  projet_id: string;
  title: string;
  description: string;
  startDate?: Date | null; 
  endDate?: Date | null;
  category: 'SOFTWARE_DEVELOPMENT' | 'MARKETING' | 'EDUCATION'
  | 'RESEARCH' | 'FINANCE'| 'DESIGN' | 'HEALTHCARE'| 'CONSTRUCTION';
}


    