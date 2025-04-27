import { Component } from '@angular/core';
import { Board } from '../../models/board.model';
import { BoardService } from '../board.service';
import { Router, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-list-board',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './list-board.component.html',
  styleUrl: './list-board.component.css'
})
export class ListBoardComponent {
boards: Board[] = [];
 searchText: string = ''; // Variable pour stocker la recherche


  constructor(private boardService: BoardService, private router: Router) {}

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.boardService.getAllBoards().subscribe(data => {
      console.log("dqtqqqqqqqqqqqqqqqqqq",data);
      
      this.boards = data;
    });
  }

  deleteBoard(id: string | undefined): void {
    if (!id) return; // 🛑 Stop si id est undefined
  
    if (confirm('Are you sure you want to delete this boards?')) {
      this.boardService.deleteBoard(id).subscribe(() => {
        this.boards = this.boards.filter(b => b._id !== id);
      });
    }
  }


  exportToPDF(): void { 
    if (!this.boards || this.boards.length === 0) {
      console.error("No boards available to export.");
      return;
    }
  
    const doc = new jsPDF();
  
    // Title Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(25);
    doc.text('TimeForge boards', 14, 10);
  
    // Subheading
    doc.setFontSize(16);
    doc.setFont('helvetica', 'italic');
    doc.text('List of all current projects in the system', 14, 20);
  
    // Line Separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 22, 200, 22);
  
    // Define table columns and data
    const columns = ['Title', 'Description'];
    const data = this.boards.map(board => [
      board.title,
      board.description,
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
        doc.text('Board title', 14, y);
        doc.text('Description', columnWidth[0] + 14, y);
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
  
    doc.save('boards.pdf');
  }
  
  
  
 // Export to Excel
 exportToExcel(): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.boards.map(board => ({
    'Board Title': board.title,
    'Description': board.description,

  })));

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Boards');
  XLSX.writeFile(wb, 'boards.xlsx');
}


}
