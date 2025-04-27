import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { GoalService } from './goal.service';
import { Goal } from './goal.model';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf, DatePipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import emailjs from 'emailjs-com';


@Component({
  selector: 'app-list-goals',
  templateUrl: './list-goals.component.html',
  styleUrls: ['./list-goals.component.css'],
  standalone: true,
  imports: [NgForOf, RouterLink, NgIf, FormsModule, DatePipe, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListGoalsComponent implements OnInit {
  goals: Goal[] = [];
  searchText = '';
  showAnimation = true;
  page: number = 1;
  itemsPerPage: number = 6;

  constructor(private goalService: GoalService, private router: Router) {}

  ngOnInit(): void {
    this.loadGoals();
    setTimeout(() => this.showAnimation = false, 6000);
    this.goals.forEach(goal => this.verifierEtEnvoyerAlerte(goal));
  }

  loadGoals(): void {
    this.goalService.getAllGoals().subscribe(data => {
      this.goals = data;
      this.goals.forEach(goal => this.verifierEtEnvoyerAlerte(goal));
    });
  }
  verifierEtEnvoyerAlerte(goal: Goal): void {
    const today = new Date();
    const endDate = new Date(goal.endDate);

    if (isNaN(endDate.getTime())) {
      console.error('❌ Date de fin invalide');
      return;
    }

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    console.log(`📅 J-${diffDays} pour le goal : ${goal.title}`);

    if ([3, 2, 1].includes(diffDays)) {
      const emailParams = {
        title: goal.title,
        description: goal.description,
        startDate: goal.startDate,
        endDate: goal.endDate,
        libelle: goal['categories']?.[0]?.libelle || 'Non précisé',
        duration: goal['categories']?.[0]?.description || 'Non précisé',
        to_email: 'mahdibenammor@gmail.com'
      };
      emailjs.send(
        'service_pbrsy9b',       // SERVICE_ID
        'template_ul44vhk',      // TEMPLATE_ID de rappel
        emailParams,
        'ID0U3W2KxG6kY1JV0'      // PUBLIC_KEY
      ).then((result) => {
        console.log(`📩 Email de rappel envoyé pour "${goal.title}" à J-${diffDays}`, result.text);
      }).catch((error) => {
        console.error('❌ Erreur e-mail de rappel :', error);
      });
    }
  }
  deleteGoal(id: string | undefined): void {
    if (!id) return;
    const goalToDelete = this.goals.find(g => g.goal_id === id);
    if (!goalToDelete) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce goal ?')) {
      this.goalService.deleteGoal(id).subscribe(() => {
        this.goals = this.goals.filter(g => g.goal_id !== id);

      });
    }
  }
  filteredGoals(): Goal[] {
    if (!this.searchText) return this.goals;
    return this.goals.filter(goal =>
      goal.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      goal.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Liste des Goals - TimeForge', 14, 15);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('Aperçu des objectifs créés', 14, 25);

    const columns = ['Titre', 'Description', 'Début', 'Fin', 'Type Libellé', 'Durée'];
    const data = this.filteredGoals().map(g => {
      const category = g.categories?.[0] || { libelle: '', description: '' };
      return [
        g.title,
        g.description,
        g.startDate ? new Date(g.startDate).toLocaleDateString() : '',
        g.endDate ? new Date(g.endDate).toLocaleDateString() : '',
        category.libelle,
        category.description
      ];
    });

    const startY = 35;
    const rowHeight = 8;
    const pageHeight = 280;
    let y = startY;
    let rowIndex = 0;
    const columnWidths = [35, 50, 25, 25, 30, 25];

    doc.setFillColor(0, 123, 255);
    doc.setTextColor(255);
    doc.setFontSize(10);
    columns.forEach((col, i) => {
      doc.rect(10 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, columnWidths[i], rowHeight, 'F');
      doc.text(col, 12 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y + 6);
    });

    y += rowHeight;

    data.forEach(row => {
      const fillColor = rowIndex % 2 === 0 ? 245 : 240;
      doc.setFillColor(fillColor, fillColor, fillColor);

      row.forEach((cell, i) => {
        const x = 10 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(x, y, columnWidths[i], rowHeight, 'F');
        doc.setTextColor(0);
        doc.text(String(cell), x + 2, y + 6);
      });

      y += rowHeight;
      rowIndex++;

      if (y > pageHeight) {
        doc.addPage();
        y = 20;
      }
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text("TimeForge App", 90, 290);
      doc.text(`Page ${i} / ${totalPages}`, 180, 290);
    }

    doc.save('goals.pdf');
  }

  exportToExcel(): void {
    const data = this.filteredGoals().map(g => {
      const category = g.categories?.[0] || { libelle: '', description: '' };
      return {
        'Titre': g.title,
        'Description': g.description,
        'Date Début': g.startDate ? new Date(g.startDate).toLocaleDateString() : '',
        'Date Fin': g.endDate ? new Date(g.endDate).toLocaleDateString() : '',
        'Type Libellé': category.libelle,
        'Durée': category.description
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Goals');
    XLSX.writeFile(wb, 'goals.xlsx');
  }

}
