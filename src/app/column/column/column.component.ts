import { Component } from '@angular/core';
import { Column } from '../../models/column.model';
import { Router, RouterModule } from '@angular/router';
import { ColumnService } from '../column.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-column',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './column.component.html',
  standalone: true,
  styleUrl: './column.component.css'
})
export class ColumnComponent {
    columns: Column[] = [];
    searchText: string = '';
  
    constructor(private columnService: ColumnService, private router: Router) {}
  
    ngOnInit(): void {
      this.loadColumns();
    }
  
    loadColumns(): void {
      this.columnService.getAllColumns().subscribe(data => {
        console.log("dqttttttt",data);
        
        this.columns = data;
      });
    }
  
    deleteColumn(id: string | undefined): void {
      if (!id) return; // 🛑 Stop si id est undefined
      if (confirm('Are you sure you want to delete this column?')) {
        this.columnService.deleteColumn(id).subscribe(() => {
          this.columns = this.columns.filter(c => c._id !== id);
        });
      }
    }
  
    exportToPDF(): void {
      if (!this.columns || this.columns.length === 0) {
        console.error("No columns available to export.");
        return;
      }
  
      const doc = new jsPDF();
  
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(25);
      doc.text('TimeForge Columns', 14, 10);
  
      doc.setFontSize(16);
      doc.setFont('helvetica', 'italic');
      doc.text('List of all current columns in the system', 14, 20);
  
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(10, 22, 200, 22);
  
      const columnsHeader = ['Name', 'Order'];
      const data = this.columns.map(column => [
        column.name,
        column.order,
      ]);
  
      const startY = 30;
      const columnWidth = [40, 100, 50];
      const rowHeight = 8;
      const pageHeight = 280;
  
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(41, 128, 185);
  
      let x = 10;
      columnsHeader.forEach((header, i) => {
        doc.rect(x, startY - 5, columnWidth[i], rowHeight, 'F');
        doc.text(header, x + 4, startY);
        x += columnWidth[i];
      });
  
      let y = startY + rowHeight;
      let rowIndex = 0;
  
      data.forEach(row => {
        doc.setFillColor(rowIndex % 2 === 0 ? 245 : 235, 235, 235);
        let x = 10;
        row.forEach((cell, i) => {
          doc.rect(x, y, columnWidth[i], rowHeight, 'F');
          doc.setTextColor(0);
          doc.setFont('helvetica', 'normal');
          doc.text(String(cell), x + 4, y + 5);
          x += columnWidth[i];
        });
  
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
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text("Time Forge Application", 90, 290);
        doc.text(`Page ${i} of ${totalPages}`, 180, 290);
      }
  
      doc.save('columns.pdf');
    }
  
    exportToExcel(): void {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.columns.map(column => ({
        'Name': column.name,
        'Ordre': column.order,
      })));
  
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Columns');
      XLSX.writeFile(wb, 'columns.xlsx');
    }
 }
  
