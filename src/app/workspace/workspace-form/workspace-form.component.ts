import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { Workspace } from '../workspace.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-workspace-form',
  templateUrl: './workspace-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  styleUrls: ['./workspace-form.component.css']
})
export class WorkspaceFormComponent implements OnInit {

  workspace: Workspace = { workspaceName: '', workspaceDescription: '' };
  isEdit = false;

  constructor(
    private workspaceService: WorkspaceService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.loadWorkspace();
  }

  loadWorkspace() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.workspaceService.getById(id).subscribe({
        next: (data) => {
          this.workspace = data;
          console.log('✅ Workspace chargé:', this.workspace);
        },
        error: (err) => console.error('❌ Erreur lors de la récupération:', err)
      });
    }
  }

  saveWorkspace(workspaceForm: NgForm) {
    console.log('📤 Données envoyées:', this.workspace); // ✅ Vérification avant l'envoi

    if (this.isEdit) {
      this.workspaceService.update(this.workspace.id!, this.workspace).subscribe({
        next: () => {
          console.log('✅ Workspace mis à jour avec succès');
          this.router.navigate(['/workspaces']);
        },
        error: (err) => console.error('❌ Erreur lors de la mise à jour:', err)
      });
    } else {
      this.workspaceService.create(this.workspace).subscribe({
        next: (response) => {
          console.log('✅ Workspace créé:', response);
          this.router.navigate(['/workspaces']);
        },
        error: (err) => console.error('❌ Erreur lors de l\'ajout:', err)
      });
    }
  }
}
