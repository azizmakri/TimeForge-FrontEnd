import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { WorkflowService } from '../workflow.service';
import { Workflow } from '../workflow.model';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import * as XLSX from 'xlsx';  // Importation pour l'exportation Excel
import { jsPDF } from 'jspdf';
import {FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    FormsModule,
    NgIf,
    NgxPaginationModule,
    DatePipe
  ],
  styleUrls: ['./workflow.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ✅ Permet d'utiliser dotlottie-player

})
export class WorkflowComponent implements OnInit {
  workflows: Workflow[] = [];
  searchText: string = ''; // Variable pour stocker la recherche
  page: number = 1;
  itemsPerPage: number = 5; // Items per page
  showAnimation = true;

  constructor(private workflowService: WorkflowService) {}


  ngOnInit(): void {
    this.loadWorkflows();
    // Hide the animation after 5 seconds and show the workflow content
    setTimeout(() => {
      this.showAnimation = false;
    }, 6000);
  }

  loadWorkflows(): void {
    // Example of adding a default value for files
    this.workflowService.getAllWorkflows().subscribe(data => {
      this.workflows = data.map(workflow => ({
        ...workflow,
        files: workflow.files || [],  // Ensure 'files' is initialized as an empty array if missing
        steps: workflow.steps || [],  // Similarly, initialize 'steps' if missing
      }));
    });
  }

  deleteWorkflow(id: string | undefined): void {
    if (confirm('Are you sure you want to delete this workflow?')) {
      this.workflowService.deleteWorkflow(id).subscribe(() => {
        this.workflows = this.workflows.filter(w => w.id !== id);
      });
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    // Title Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(25);
    doc.text('TimeForge Workflows', 14, 10);

    // Subheading (add a small description or tagline)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'italic');
    doc.text('List of all current workflows in the system', 14, 20);

    // Line Separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 22, 200, 22); // Line below the header

    // Define table columns and data
    const columns = ['Workflow Name', 'Steps'];
    const data = this.workflows.map(workflow => [
      workflow.workflowName,
      workflow.steps.join(', '), // Join steps into a single string
      workflow.startDate,
      workflow.endDate
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

    // Draw column headers with background filll
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
      // @ts-ignore
      doc.text(row[0], 14, y + 5); // First column data
      // @ts-ignore
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
    doc.save('workflows.pdf');
  }


  // Méthode pour filtrer les workflows en fonction de la recherche
  filteredWorkflows(): Workflow[] {
    if (!this.searchText) {
      return this.workflows;
    }
    return this.workflows.filter(workflow =>
      workflow.workflowName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      workflow.steps.some(step =>
        step.toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
  // Exporter vers Excel

    exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.workflows.map(workflow => ({
      'Workflow Name': workflow.workflowName,
      'Steps': workflow.steps.join(', '),
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
    XLSX.utils.book_append_sheet(wb, ws, 'Workflows');
    XLSX.writeFile(wb, 'workflows.xlsx');
  }


  downloadFile(workflowId: string | undefined, fileName: string): void {

    this.workflowService.downloadFile(workflowId, fileName).subscribe(
      (blob) => {
        saveAs(blob, fileName);
      },
      (error) => {
        console.error(`❌ Download failed for workflow: ${workflowId}`, error);
      }
    );
  }


}
