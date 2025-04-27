import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../task.service';
import {  ActivatedRoute, Router } from '@angular/router';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import {CommonModule,} from '@angular/common';
@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit{
  task: Task = {
    name: '',
    description: '',
    createdAt: new Date(),
    dueDate: new Date(),
    priority: 'LOW',
    columnId: '',
    history: []
  };

  oldTask: Task | null = null;
  isEdit = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.taskService.getTaskById(id).subscribe(task => {
        this.task = { ...task, history: task.history || [] };
        this.oldTask = { ...task }; // 👈 garde l’état original pour comparaison
      });
    }
  }

  saveTask(): void {
    const now = new Date().toLocaleString();

    const historyEntry = this.isEdit && this.oldTask
      ? `Updated on ${now}: ${this.generateUpdateLog(this.oldTask, this.task)}`
      : `Created on ${now}`;

    const taskToSave: Task = {
      ...this.task,
      history: [...(this.task.history || []), historyEntry]
    };

    if (this.isEdit && this.task._id) {
      this.taskService.updateTask(taskToSave).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.taskService.createTask(taskToSave).subscribe(newTask => {
        this.task = newTask;
        this.router.navigate(['/tasks']);
      });
    }
  }

  private generateUpdateLog(oldTask: Task, updatedTask: Task): string {
    let log = '';

    if (oldTask.name !== updatedTask.name) {
      log += `Name changed from "${oldTask.name}" to "${updatedTask.name}". `;
    }
    if (oldTask.description !== updatedTask.description) {
      log += `Description changed. `;
    }
    if (oldTask.dueDate !== updatedTask.dueDate) {
      log += `Due date changed from ${new Date(oldTask.dueDate).toLocaleDateString()} to ${new Date(updatedTask.dueDate).toLocaleDateString()}. `;
    }
    if (oldTask.priority !== updatedTask.priority) {
      log += `Priority changed from "${oldTask.priority}" to "${updatedTask.priority}". `;
    }
    if (oldTask.columnId !== updatedTask.columnId) {
      log += `Column changed. `;
    }

    return log.trim() || 'No specific changes recorded.';
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
