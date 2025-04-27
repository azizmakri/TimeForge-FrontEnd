export class Workflow {
  id: string;
  workflowName: string;
  steps: string[];
  startDate: Date | string;  // Ajoute la possibilité d'être string si nécessaire
  endDate: Date | string;    // Même chose ici
  files: any[];
}
