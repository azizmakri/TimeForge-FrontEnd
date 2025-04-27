import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Board } from '../../models/board.model';
import { Task } from '../../models/task.model';
import { Column } from '../../models/column.model';

import { BoardService } from '../board.service';
import { TaskService } from '../../task/task.service';
import { ColumnService } from '../../column/column.service';
import { TaskDetailsComponent } from '../../task/task-details/task-details.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  isModalOpen = false;
  isTaskOpen = false;

  selectedColumns: Column[] = [];
  availableColumns: Column[] = [];
  selectedCulumn: Column;

  tasks: Task[] = [];
  selectedTaskIds: Set<string> = new Set();

  board: Board = {
    title: 'Test Board',
    description: 'Welcome to Board',
    columns: []
  };

  id: string
  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private taskService: TaskService,
    private columnService: ColumnService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.getColumnBoard(this.id);
  }

  getColumnBoard(id: string): void {
    this.columnService.getColumnByIdBoard(id).subscribe(data => {
      this.board.columns = data;
    });
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  openModal(): void {
    this.getColumns();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  getColumns(): void {
    this.columnService.getAllColumns().subscribe(data => {
      this.availableColumns = data;
    });
  }

  confirmSelection(): void {
    this.selectedColumns.forEach(col => {
      col.board = this.id!;
    });
    this.columnService.saveListColumn(this.selectedColumns).subscribe(() => {
      this.getColumnBoard(this.id);
    });
    this.closeModal();
  }

  closeTaskModal(): void {
    this.isTaskOpen = false;
  }

  addTask(column: Column): void {
    this.selectedTaskIds.clear();
    this.isTaskOpen = true;
    this.loadTasks();
    this.selectedCulumn = column;
  }

  confirmTaskSelection(): void {
    if (this.selectedCulumn && this.selectedCulumn._id) {
      const selectedTasks = this.tasks.filter(task => task._id && this.selectedTaskIds.has(task._id));
      this.selectedCulumn.tasks = selectedTasks;

      this.columnService.addTaskToColumn(this.selectedCulumn).subscribe(() => {
        this.getColumnBoard(this.id);
        this.closeTaskModal();
      });
    } else {
      console.error("Selected column is missing an ID or is undefined");
    }
  }

  toggleTaskSelection(taskId: string, event: Event): void {
    if (!taskId) return;
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedTaskIds.add(taskId);
    else this.selectedTaskIds.delete(taskId);
  }

  toggleAllTasks(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedTaskIds = new Set(this.tasks.map(task => task._id).filter((id): id is string => !!id));
    } else {
      this.selectedTaskIds.clear();
    }
  }

  isTaskSelected(taskId: string): boolean {
    return taskId ? this.selectedTaskIds.has(taskId) : false;
  }
  removeTask(columnIndex: number, taskIndex: number): void {
    this.board.columns[columnIndex].tasks.splice(taskIndex, 1);
    this.columnService.updateColumn(this.board.columns[columnIndex]).subscribe(() => {
      this.getColumnBoard(this.id);
    });
  }

  removeColumnFromBoard(column: Column): void {
    this.columnService.removeBoardFromColumn(column).subscribe(() => {
      this.getColumnBoard(this.id);
    });
  }


  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const fromColumn = this.board.columns.find(col => col.tasks === event.previousContainer.data);
      const movedTask = event.container.data[event.currentIndex];
      const destinationColumn = this.board.columns.find(col => col.tasks === event.container.data);
      this.columnService.moveTask(movedTask._id, fromColumn._id, destinationColumn._id).subscribe(() => {
        this.getColumnBoard(this.id);
      });
    }
  }

  onViewTask(task: Task): void {
    this.dialog.open(TaskDetailsComponent, { data: task });
  }

  exportBoardAsPDF(): void {
    const boardElement = document.querySelector('.board-columns') as HTMLElement;
    if (!boardElement) return;

    html2canvas(boardElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a5');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width * 1.75;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Kanban_Board.pdf');
    });
  }

  exportBoardAsExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.convertBoardToExcelFormat());
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kanban Board');
    XLSX.writeFile(wb, 'Kanban_Board.xlsx');
  }

  convertBoardToExcelFormat(): any[] {
    const tasks: any[] = [];
    this.board.columns.forEach(column => {
      column.tasks.forEach(task => {
        tasks.push({
          Column: column.name,
          Task: task.name,
          Priority: task.priority,
          DueDate: new Date(task.dueDate).toDateString()
        });
      });
    });
    return tasks;
  }

  colors = ['#FFB3B3', '#FFE0B3', '#D4FFB3', '#B3E5FF'];
  titleColors = ['#000000', '#000000', '#000000', '#000000'];

  getColumnColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getTitleColor(index: number): string {
    return this.titleColors[index % this.titleColors.length];
  }
}
