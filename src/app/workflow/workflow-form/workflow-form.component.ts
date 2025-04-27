import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workflow } from '../workflow.model';
import { WorkflowService } from '../workflow.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  styleUrls: ['./workflow-form.component.css']
})
export class WorkflowFormComponent implements OnInit {
  workflow: Workflow = {
    id: '',
    workflowName: '',
    startDate: undefined,
    endDate: undefined,
    steps: [],
    files: []
  };

  file: File | null = null;
  isEdit = false;
  errorMessage: string | null = null;

  constructor(
    private workflowService: WorkflowService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.workflowService.getWorkflowById(id).subscribe({
        next: (data) => this.workflow = data,
        error: (err) => this.errorMessage = 'Erreur lors du chargement du workflow.'
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.file = input.files[0];
    }
  }

  addStep(): void {
    this.workflow.steps.push('');
  }

  removeStep(index: number): void {
    this.workflow.steps.splice(index, 1);
  }

  saveWorkflow(): void {
    if (this.workflow.workflowName && this.workflow.workflowName.length >= 3) {
      // Format dates en ISO string avant de les ajouter à FormData
      if (this.workflow.startDate instanceof Date) {
        this.workflow.startDate = this.workflow.startDate.toISOString().split('T')[0]; // Format yyyy-mm-dd
      }
      if (this.workflow.endDate instanceof Date) {
        this.workflow.endDate = this.workflow.endDate.toISOString().split('T')[0]; // Format yyyy-mm-dd
      }

      const formData = new FormData();
      formData.append('workflowName', this.workflow.workflowName);
      formData.append('steps', JSON.stringify(this.workflow.steps));  // Assurez-vous que les étapes sont bien envoyées comme chaîne
      formData.append('file', this.file, this.file.name);
      formData.append('startDate', this.workflow.startDate);  // Ajouter la date au format string
      formData.append('endDate', this.workflow.endDate);      // Ajouter la date au format string

      if (this.isEdit) {
        // Si c'est un mode édition, utiliser updateWorkflow
        this.workflowService.updateWorkflow(this.workflow.id, formData).subscribe({
          next: () => this.router.navigate(['/workflows']),
          error: (err) => {
            console.error('Erreur:', err);
            this.errorMessage = 'Erreur lors de la mise à jour du workflow.';
          }
        });
      } else {
        // Sinon, c'est un nouveau workflow
        this.workflowService.createWorkflow(formData).subscribe({
          next: () => this.router.navigate(['/workflows']),
          error: (err) => {
            console.error('Erreur:', err);
            this.errorMessage = 'Erreur lors de l’enregistrement du workflow.';
          }
        });
      }
    } else {
      this.errorMessage = 'Le nom du workflow doit contenir au moins 3 caractères.';
    }
  }
}
