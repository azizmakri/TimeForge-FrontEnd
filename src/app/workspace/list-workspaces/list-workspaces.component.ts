import { Component, OnInit , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { WorkspaceService } from '../workspace.service';
import { NgForOf, CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { Workspace } from '../workspace.model';
import {FormsModule} from "@angular/forms";
import {jsPDF} from 'jspdf';
import * as XLSX from 'xlsx';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-list-workspaces',
  templateUrl: './list-workspaces.component.html',
  standalone: true,
  imports: [
    NgForOf,
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  styleUrls: ['./list-workspaces.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ListWorkspacesComponent implements OnInit {
  page: number = 1;
  searchText: string = '';
  workspaces: Workspace[] = [];
  showAnimation = true;  // To control if the animation is visible
  itemsPerPage: number = 5; // Adjust as needed


  ngOnInit(): void {
    this.loadWorkspaces();
    // Hide the animation after 5 seconds and show the workflow content
    setTimeout(() => {
      this.showAnimation = false;
    }, 6000);
  }

  constructor(private workspaceService: WorkspaceService , protected router : Router) {}


  loadWorkspaces() {
    this.workspaceService.getAll().subscribe({
      next: (data) => {
        console.log('Workspaces chargés:', data);
        this.workspaces = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des workspaces :', err);
      }
    });
  }


  deleteWorkspace(id: number | undefined) {
    if (!id) return;

    if (confirm('Voulez-vous vraiment supprimer cet espace de travail ?')) {
      this.workspaceService.delete(id).subscribe({
        next: () => {
          console.log(`Workspace ${id} supprimé avec succès`);
          this.loadWorkspaces();
        },
        error: (err) => console.error('Erreur lors de la suppression du workspace :', err)
      });
    }
  }
  exportToPDF(): void {
    const doc = new jsPDF();

    // Title Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(25);
    doc.text('TimeForge Workspaces', 14, 10);

    // Subheading (add a small description or tagline)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'italic');
    doc.text('List of all current workspaces in the system', 14, 20);

    // Line Separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 22, 200, 22); // Line below the header

    // Define table columns and data
    const columns = ['Workspace Name', 'WorkspaceDescription'];
    const data = this.workspaces.map(workspace => [
      workspace.workspaceName,
      workspace.workspaceDescription, // Join steps into a single string
    ]);

    // Table formatting options
    const startY = 30; // Start position of the table (below the header)
    const columnWidth = [70, 120]; // Adjusted column widths for better fit
    const rowHeight = 8; // Adjust row height for better clarity
    const pageHeight = 280; // Max height for content before pagination

    // Table Header Styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255); // White text for headers
    doc.setFillColor(41, 128, 185); // Blue background for headers

    // Draw column headers with background fill
    doc.rect(10, startY - 5, columnWidth[0], rowHeight, 'F'); // First header cell background
    doc.rect(columnWidth[0] + 10, startY - 5, columnWidth[1], rowHeight, 'F'); // Second header cell background
    doc.text(columns[0], 14, startY); // First column header text
    doc.text(columns[1], columnWidth[0] + 14, startY); // Second column header text

    // Draw table rows with alternating row colors and borders
    let y = startY + rowHeight;
    let rowIndex = 0;

    data.forEach(row => {
      // Alternating row colors
      doc.setFillColor(rowIndex % 2 === 0 ? 245 : 245, 245, 245); // Light grey
      doc.rect(10, y, columnWidth[0], rowHeight, 'F'); // First column cell background
      doc.rect(columnWidth[0] + 10, y, columnWidth[1], rowHeight, 'F'); // Second column cell background

      // Draw text for each cell
      doc.setTextColor(0); // Black text for row data
      doc.setFont('helvetica', 'normal');
      doc.text(row[0], 14, y + 5); // First column data
      doc.text(row[1], columnWidth[0] + 14, y + 5); // Second column data

      y += rowHeight; // Move to the next row
      rowIndex++;

      // Check if we need to create a new page
      if (y > pageHeight) {
        doc.addPage(); // Create new page
        y = 20; // Reset y position for the new page
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Workflow Name', 14, y);  // Re-print headers on new page
        doc.text('Steps', columnWidth[0] + 14, y);
        y += rowHeight; // Move y position below headers
      }
    });

    // Get the total number of pages
    const totalPages = doc.internal.pages.length;

    // Footer: Page number
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text("Time Forge Application",90,290)
      doc.text(`Page ${i} of ${totalPages}`, 180, 290); // Page number at the bottom right
    }
    // Save the PDF
    doc.save('workspaces.pdf');
  }

  // Méthode pour filtrer les workflows en fonction de la recherche
  filteredWorkspaces(): Workspace[] {
    if (!this.searchText) {
      return this.workspaces;
    }
    return this.workspaces.filter(workspace =>
      workspace.workspaceName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  // Exporter vers Excel

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.workspaces.map(workspace => ({
      'workspaceName': workspace.workspaceName,
      'workspaceDescription': workspace.workspaceDescription,
    })));

    // Apply font style to the header row
    ws['A1'].s = {
      font: {
        bold: true,
        color: { rgb: 'FFFFFF' }, // White text
        sz: 12, // Font size
      },
      fill: {
        fgColor: { rgb: '4F81BD' }, // Blue background
      }
    };
    ws['B1'].s = {
      font: {
        bold: true,
        color: { rgb: 'FFFFFF' }, // White text
        sz: 12, // Font size
      },
      fill: {
        fgColor: { rgb: '4F81BD' }, // Blue background
      }
    };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Workspaces');
    XLSX.writeFile(wb, 'workspaces.xlsx');
  }
}
