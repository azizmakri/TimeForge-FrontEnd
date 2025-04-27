import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../task.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {FormsModule} from '@angular/forms';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-task',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './task.component.html',
  standalone: true,
  styleUrl: './task.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaskComponent implements OnInit {
tasks: Task[] = [];
searchText: string = '';
  constructor(private taskService: TaskService, private dialog: MatDialog) {}


  showAnimation = true;  // To control if the animation is visible

  ngOnInit(): void {
    this.loadTasks();
    // Hide the animation after 5 seconds and show the workflow content
    setTimeout(() => {
      this.showAnimation = false;
    }, 6000);
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(data => {
      this.tasks = data;
    });
  }
  // Initialisation avec des valeurs undefined au lieu de ''
// filters: {
//   name?: string;
//   priority?: string;
//   assignedToId?: string;
//   projectId?: string;
// } = {};

// // Applique les filtres automatiquement
// applyFilters(): void {
//   this.taskService.searchTasks(this.filters).subscribe(data => {
//     this.tasks = data;
//   });
// }

// clearFilter(filterName: keyof typeof this.filters): void {
//   this.filters[filterName] = undefined;
//   this.applyFilters();
// }

  deleteTask(id: string | undefined): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.tasks = this.tasks.filter(t => t._id !== id);
      });
    }
  }
  onViewTask(task: Task): void {
    this.dialog.open(TaskDetailsComponent, {
      data: task,
    });
  }
  exportToPDF(): void {
      if (!this.tasks || this.tasks.length === 0) {
        console.error("No projects available to export.");
        return;
      }

      const doc = new jsPDF();

      // Title Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(25);
      doc.text('TimeForge Tasks', 14, 10);

      // Subheading
      doc.setFontSize(16);
      doc.setFont('helvetica', 'italic');
      doc.text('List of all current tasks in the system', 14, 20);

      // Line Separator
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(10, 22, 200, 22);

      // Define table columns and data
      const columns = ['Name', 'Description', 'Created Date', 'Due Date', 'Priority'];
      const data = this.tasks.map(task => [
        task.name,
        task.description,
        task.createdAt,
        task.dueDate,
        task.priority
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
          doc.text('Name', 14, y);
          doc.text('Description', columnWidth[0] + 14, y);
          doc.text('Created Date', columnWidth[0] + columnWidth[1] + 14, y);
          doc.text('Due Date', columnWidth[0] + columnWidth[1] + columnWidth[2] + 14, y);
          doc.text('Priority', columnWidth[0] + columnWidth[1] + columnWidth[2] + columnWidth[3] + 14, y);
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

      doc.save('tasks.pdf');
    }


  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tasks.map(task => ({
      'Task Name': task.name,
      'Description': task.description,
      'Created At': task.createdAt ? task.createdAt.toISOString().split('T')[0] : 'N/A',
      'Due Date': task.dueDate ? task.dueDate.toISOString().split('T')[0] : 'N/A',
      'Priority': task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    })));

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'tasks.xlsx');
  }
}

