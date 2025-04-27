import { ProjectService } from '../project.service';
import {CommonModule, NgForOf} from '@angular/common';
import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {Router, RouterLink, RouterModule} from '@angular/router';
import { Project } from '../../models/project.model';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';  // Importation pour l'exportation Excel
import {FormsModule} from '@angular/forms';  // Importation pour l'exportation PDF
import { of } from 'rxjs';

@Component({
  selector: 'app-project',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './project.component.html',
  standalone: true,
  styleUrl: './project.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectComponent implements OnInit {
projects: Project[] = [];
 searchText: string = ''; // Variable pour stocker la recherche


  constructor(private projectService: ProjectService, private router: Router) {}

  showAnimation = true;  // To control if the animation is visible

  ngOnInit(): void {
    this.loadProjects();
    // Hide the animation after 5 seconds and show the workflow content
    setTimeout(() => {
      this.showAnimation = false;
    }, 6000);
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(data => {
      this.projects = data;
    });
  }

  deleteProject(id: string | undefined): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => {
        this.projects = this.projects.filter(p => p.projet_id !== id);
      });
    }
  }
  exportToPDF(): void {
    if (!this.projects || this.projects.length === 0) {
      console.error("No projects available to export.");
      return;
    }

    const doc = new jsPDF();

    // Title Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(25);
    doc.text('TimeForge Projects', 14, 10);

    // Subheading
    doc.setFontSize(16);
    doc.setFont('helvetica', 'italic');
    doc.text('List of all current projects in the system', 14, 20);

    // Line Separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 22, 200, 22);

    // Define table columns and data
    const columns = ['Title', 'Description', 'Start Date', 'End Date', 'Category'];
    const data = this.projects.map(project => [
      project.title,
      project.description,
      project.startDate,
      project.endDate,
      project.category
    ]);

    // Table formatting options
    const startY = 30;
    const columnWidth = [20, 60, 30, 30, 45];
    const rowHeight = 8;
    const pageHeight = 280;

    // Table Header Styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(41, 128, 185);

    // Draw column headers
    doc.rect(10, startY - 5, columnWidth[0], rowHeight, 'F');
    doc.rect(columnWidth[0] + 10, startY - 5, columnWidth[1], rowHeight, 'F');
    doc.rect(columnWidth[0] + columnWidth[1] + 10, startY - 5, columnWidth[2], rowHeight, 'F');
    doc.rect(columnWidth[0] + columnWidth[1] + columnWidth[2] + 10, startY - 5, columnWidth[3], rowHeight, 'F');
    doc.rect(columnWidth[0] + columnWidth[1] + columnWidth[2] + columnWidth[3] + 10, startY - 5, columnWidth[4], rowHeight, 'F');

    doc.text(columns[0], 14, startY);
    doc.text(columns[1], columnWidth[0] + 14, startY);
    doc.text(columns[2], columnWidth[0] + columnWidth[1] + 14, startY);
    doc.text(columns[3], columnWidth[0] + columnWidth[1] + columnWidth[2] + 14, startY);
    doc.text(columns[4], columnWidth[0] + columnWidth[1] + columnWidth[2] + columnWidth[3] + 14, startY);

    // Draw table rows
    let y = startY + rowHeight;
    let rowIndex = 0;

    data.forEach(row => {
      doc.setFillColor(rowIndex % 2 === 0 ? 245 : 235, 235, 235);
      doc.rect(10, y, columnWidth[0], rowHeight, 'F');
      doc.rect(columnWidth[0] + 10, y, columnWidth[1], rowHeight, 'F');
      doc.rect(columnWidth[0] + columnWidth[1] + 10, y, columnWidth[2], rowHeight, 'F');
      doc.rect(columnWidth[0] + columnWidth[1] + columnWidth[2] + 10, y, columnWidth[3], rowHeight, 'F');
      doc.rect(columnWidth[0] + columnWidth[1] + columnWidth[2] + columnWidth[3] + 10, y, columnWidth[4], rowHeight, 'F');

      doc.setTextColor(0);
      doc.setFont('helvetica', 'normal');
      doc.text(String(row[0]), 14, y + 5);
      doc.text(String(row[1]), columnWidth[0] + 14, y + 5);
      doc.text(String(row[2]), columnWidth[0] + columnWidth[1] + 14, y + 5);
      doc.text(String(row[3]), columnWidth[0] + columnWidth[1] + columnWidth[2] + 14, y + 5);
      doc.text(String(row[4]), columnWidth[0] + columnWidth[1] + columnWidth[2] + columnWidth[3] + 14, y + 5);

      y += rowHeight;
      rowIndex++;

      if (y > pageHeight) {
        doc.addPage();
        y = 20;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Project Name', 14, y);
        doc.text('Description', columnWidth[0] + 14, y);
        doc.text('Start Date', columnWidth[0] + columnWidth[1] + 14, y);
        doc.text('End Date', columnWidth[0] + columnWidth[1] + columnWidth[2] + 14, y);
        doc.text('Category', columnWidth[0] + columnWidth[1] + columnWidth[2] + columnWidth[3] + 14, y);
        y += rowHeight;
      }
    });

    // Footer: Page number
    const totalPages = doc.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text("Time Forge Application", 90, 290);
      doc.text(`Page ${i} of ${totalPages}`, 180, 290);
    }

    doc.save('projects.pdf');
  }



 // Export to Excel
 exportToExcel(): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.projects.map(project => ({
    'Project Title': project.title,
    'Description': project.description,
    'Start Date': project.startDate,
    'End Date': project.endDate,
    'Project Category': project.category,
  })));

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Projects');
  XLSX.writeFile(wb, 'projects.xlsx');
}


}
