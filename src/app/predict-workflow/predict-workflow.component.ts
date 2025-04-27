import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common'; // Importation de Reactive Forms

@Component({
  selector: 'app-predict-workflow',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './predict-workflow.component.html',
  styleUrls: ['./predict-workflow.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PredictWorkflowComponent {
  form: FormGroup;
  prediction: string | null = null;
  errorMessage: string | null = null;
  showAnimation = true; // Ajout d'une variable pour contrôler l'animation de chargement

  constructor(private http: HttpClient, private fb: FormBuilder) {
    // Création du formulaire avec validation
    this.form = this.fb.group({
      steps: ['', Validators.required]
    });
  }

  predict() {
    if (this.form.invalid) {
      this.errorMessage = "Les champs 'steps' sont requis.";
      this.prediction = null;
      return;
    }

    // Récupération des valeurs du formulaire
    const { steps } = this.form.value;

    this.prediction = null;
    this.errorMessage = null;
    this.showAnimation = true; // Affichage de l'animation de chargement

    const body = { steps };

    this.http.post<any>('http://localhost:5000/predict', body).subscribe({
      next: (response) => {
        this.prediction = response.prediction;
        this.showAnimation = true; // Masquage de l'animation
      },
      error: (error) => {
        console.error('Erreur :', error);
        this.errorMessage = 'Erreur lors de la prédiction. Veuillez réessayer.';
        this.showAnimation = true; // Masquage de l'animation
      }
    });
  }
}
