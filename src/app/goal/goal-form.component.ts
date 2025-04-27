import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal } from './goal.model';
import { GoalService } from './goal.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-goal-form',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule]
})
export class GoalFormComponent implements OnInit {
  goal: Goal = { title: '', description: '' };
  isEdit = false;
  serverError = '';
  estimatedDuration: number | null = null;
  showEstimate = false;

  newCategory = {
    libelle: '',
    description: ''
  };

  constructor(
    private goalService: GoalService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.goalService.getGoalById(id).subscribe(data => {
        this.goal = data;

      });
    }
  }

  checkLibelleAndEstimate(): void {
    const libelle = this.newCategory.libelle.trim();
    if (!libelle) {
      this.showEstimate = false;
      this.estimatedDuration = null;
      return;
    }

    this.goalService.getEstimatedDurationDays(libelle).subscribe({
      next: (duration) => {
        if (duration === null || duration === undefined) {
          this.showEstimate = false;
          this.estimatedDuration = null;
          return;
        }

        this.estimatedDuration = duration;
        this.showEstimate = true;
        this.newCategory.description = `${duration} jours`;
      },
      error: () => {
        this.showEstimate = false;
        this.estimatedDuration = null;
      }
    });
  }

  saveGoal(): void {
    this.serverError = ''; // reset erreur

    if (this.goal.title.trim().length < 3 || this.goal.description.trim().length < 5) {
      this.serverError = 'Veuillez remplir les champs correctement.';
      return;
    }

    if (!this.newCategory.libelle) {
      this.serverError = 'Complétez la catégorie.';
      return;
    }

    if (!this.goal.startDate || !this.goal.endDate) {
      this.serverError = 'Veuillez sélectionner une date de début et une date de fin.';
      return;
    }

    const start = new Date(this.goal.startDate);
    const end = new Date(this.goal.endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    const expectedDuration = this.estimatedDuration ?? parseInt(this.newCategory.description);

    if (isNaN(expectedDuration)) {
      this.serverError = 'La durée n’est pas valide.';
      return;
    }

    if (diffDays !== expectedDuration) {
      this.serverError = `⚠️ La durée entre les deux dates est de ${diffDays} jours, alors que la durée attendue est de ${expectedDuration} jours.`;
      return;
    }

    const payload = {
      goal: {
        title: this.goal.title,
        description: this.goal.description,
        startDate: this.goal.startDate,
        endDate: this.goal.endDate
      },
      categories: [
        {
          libelle: this.newCategory.libelle,
          description: this.newCategory.description
        }
      ]
    };

    this.goalService.createGoalWithCategories(payload).subscribe({
      next: () => {
        // Envoi de l'e-mail après création
        const emailParams = {
          title: this.goal.title,
          description: this.goal.description,
          startDate: this.goal.startDate,
          endDate: this.goal.endDate,
          libelle: this.newCategory.libelle,
          duration: this.estimatedDuration ?? this.newCategory.description,
          to_email: 'mzoughi.mahdi@esprit.tn'
        };

        emailjs.send(
          'service_pbrsy9b',        // ton SERVICE_ID
          'template_8yzvs5q',       // ton TEMPLATE_ID
          emailParams,
          'ID0U3W2KxG6kY1JV0'       // ta clé publique (PUBLIC_KEY)
        ).then((result) => {
          console.log('✅ Email envoyé !', result.text);
        }).catch((error) => {
          console.error('❌ Erreur lors de l’envoi de l’e-mail :', error);
        });

        this.router.navigate(['/goals']);
      },
      error: (err) => {
        this.serverError = err.error;
      }
    });
  }

}
