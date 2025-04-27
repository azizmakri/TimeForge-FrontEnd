import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
  import { RewardService } from './reward.service';
  import { Reward } from './reward.model';
  import {NgForOf, DatePipe, NgIf} from '@angular/common';
  import {FormsModule } from '@angular/forms';
  import { jsPDF } from 'jspdf';
  import * as XLSX from 'xlsx';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

  @Component({
    selector: 'app-list-rewards',
    templateUrl: './list-rewards.component.html',
    styleUrls: ['./list-rewards.component.css'],
    standalone: true,
    imports: [NgForOf, RouterLink, DatePipe, FormsModule, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class ListRewardsComponent implements OnInit {
    rewards: Reward[] = [];
    searchText: string = '';

    constructor(private rewardService: RewardService, private router: Router) {}


    showAnimation = true;  // To control if the animation is visible

    ngOnInit(): void {
      this.loadRewards();
      // Hide the animation after 5 seconds and show the workflow content
      setTimeout(() => {
        this.showAnimation = false;
      }, 6000);
    }

    loadRewards(): void {
      this.rewardService.getAllRewards().subscribe(data => {
        this.rewards = data;
      });
    }

    deleteReward(id: string | undefined): void {
      if (!id) return;
      if (confirm('Êtes-vous sûr de vouloir supprimer cette reward ?')) {
        this.rewardService.deleteReward(id).subscribe(() => {
          this.rewards = this.rewards.filter(r => r.id !== id);
        });
      }
    }

    filteredRewards(): Reward[] {
      if (!this.searchText) return this.rewards;
      return this.rewards.filter(r =>
        r.type.toLowerCase().includes(this.searchText.toLowerCase()) ||
        r.description.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    exportToPDF(): void {
      const doc = new jsPDF();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('Liste des Rewards - TimeForge', 14, 10);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'italic');
      doc.text('Historique des récompenses attribuées', 14, 20);

      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(10, 22, 200, 22);

      const columns = ['Type', 'Description', 'Date'];
      const data = this.filteredRewards().map(r => [
        r.type,
        r.description,
        r.dateAwarded ? new Date(r.dateAwarded).toLocaleDateString() : ''
      ]);

      const startY = 30;
      const columnWidth = [50, 100, 40];
      const rowHeight = 8;
      const pageHeight = 280;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255);
      doc.setFillColor(220, 53, 69); // rouge foncé

      doc.rect(10, startY - 5, columnWidth[0], rowHeight, 'F');
      doc.rect(10 + columnWidth[0], startY - 5, columnWidth[1], rowHeight, 'F');
      doc.rect(10 + columnWidth[0] + columnWidth[1], startY - 5, columnWidth[2], rowHeight, 'F');

      doc.text(columns[0], 14, startY);
      doc.text(columns[1], 14 + columnWidth[0], startY);
      doc.text(columns[2], 14 + columnWidth[0] + columnWidth[1], startY);

      let y = startY + rowHeight;
      let rowIndex = 0;

      data.forEach(row => {
        doc.setFillColor(rowIndex % 2 === 0 ? 245 : 245, 245, 245);
        doc.rect(10, y, columnWidth[0], rowHeight, 'F');
        doc.rect(10 + columnWidth[0], y, columnWidth[1], rowHeight, 'F');
        doc.rect(10 + columnWidth[0] + columnWidth[1], y, columnWidth[2], rowHeight, 'F');

        doc.setTextColor(0);
        doc.setFont('helvetica', 'normal');
        doc.text(row[0], 14, y + 5);
        doc.text(row[1], 14 + columnWidth[0], y + 5);
        doc.text(row[2], 14 + columnWidth[0] + columnWidth[1], y + 5);

        y += rowHeight;
        rowIndex++;

        if (y > pageHeight) {
          doc.addPage();
          y = 20;
        }
      });

      const totalPages = doc.internal.pages.length;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('TimeForge Rewards', 90, 290);
        doc.text(`Page ${i} / ${totalPages}`, 180, 290);
      }

      doc.save('rewards.pdf');
    }

    exportToExcel(): void {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        this.filteredRewards().map(r => ({
          'Type': r.type,
          'Description': r.description,
          'Date d\'attribution': r.dateAwarded ? new Date(r.dateAwarded).toLocaleDateString() : ''
        }))
      );

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Rewards');
      XLSX.writeFile(wb, 'rewards.xlsx');
    }

  }
