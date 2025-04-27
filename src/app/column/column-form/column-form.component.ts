import { Component, OnInit } from '@angular/core';
import { Column } from '../../models/column.model';
import { ColumnService } from '../column.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './column-form.component.html',
  styleUrl: './column-form.component.css'
})
export class ColumnFormComponent implements OnInit {
    column: Column = {
      _id:"",
      name: '',
      board: '',
      order: 0,
      tasks: []
    };
  
    isEdit: boolean = false;
  
    constructor(
      private columnService: ColumnService,
      private route: ActivatedRoute,
      protected router: Router
    ) {}
  
    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && id !== 'string') {
        this.isEdit = true;
        this.columnService.getColumnById(id).subscribe(data => {
          this.column = data;
        });
      }
    }
  
    saveColumn(columnForm: NgForm) {
      console.log( "this.column",this.column);
      
      if (this.isEdit) {
        if (!this.column._id) {
          console.error('❌ Error: Invalid ID');
          return;
        }
        this.columnService.updateColumn(this.column).subscribe({
          next: () => {
            console.log('✅ Column updated successfully');
            this.router.navigate(['/columns']);
          },
          error: (err) => console.error('❌ Error updating column:', err)
        });
      } else {
        console.log("this.column",this.column);
        this.columnService.createColumn(this.column).subscribe({
          next: () => {
            console.log('✅ Column created successfully');
            this.router.navigate(['/columns']);
          },
          error: (err) => console.error('❌ Error creating column:', err)
        });
      }
    }
}
