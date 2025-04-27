import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictWorkflowComponent } from './predict-workflow.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';  // Pour ngModel, si nécessaire

@NgModule({
  declarations: [],
  imports: [
    CommonModule,  // Ajoutez CommonModule ici
    FormsModule,
    PredictWorkflowComponent,
    ReactiveFormsModule
    // Si vous utilisez ngModel pour les formulaires
  ],
  exports: [PredictWorkflowComponent]
})
export class PredictWorkflowModule { }
