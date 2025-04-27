import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import { Project } from '../../models/project.model';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})

export class ProjectFormComponent implements OnInit {
  project: Project = {
    projet_id: '',
    title: '',
    description: '',
    category: 'DESIGN', // Valeur par défaut mise à jour
    startDate: new Date(),
    endDate: undefined
  };
  
  isEdit: boolean = false;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'string') {
      this.isEdit = true;
      this.projectService.getProjectById(id).subscribe(data => {
        this.project = data;
      });
    }
  }

  saveProject(projectForm: NgForm) {
    if (this.isEdit) {
      if (!this.project.projet_id) {
        console.error('❌ Error: Invalid ID');
        return;
      }
      this.projectService.updateProject(this.project.projet_id, this.project).subscribe({
        next: () => {
          console.log('✅ Project updated successfully');
          this.router.navigate(['/projects']);
        },
        error: (err) => console.error('❌ Error updating project:', err)
      });
    } else {
      this.projectService.createProject(this.project).subscribe({
        next: () => {
          console.log('✅ Project created successfully');
          this.router.navigate(['/projects']);
        },
        error: (err) => console.error('❌ Error creating project:', err)
      });
    }
  }
}
