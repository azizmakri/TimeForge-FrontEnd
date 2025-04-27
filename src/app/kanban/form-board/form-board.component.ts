import { Component } from '@angular/core';
import { Board } from '../../models/board.model';
import { BoardService } from '../board.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-board',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-board.component.html',
  styleUrl: './form-board.component.css'
})
export class FormBoardComponent {
  board: Board = {
    title: '',
    description: '',
    columns: [] = []
  };
  isEdit: boolean = false;

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("qqqqqqqqqqqqq",id);
    
    if (id) {
      this.isEdit = true;
      this.boardService.getBoardById(id).subscribe(data => {
        console.log("dqtqqqqqqqqqq",data);
        
        this.board = data;
      });
    }
  }

  saveBoard() {
    console.log("this.board",this.board);
    if (this.isEdit) {
      if (!this.board) {
        console.error('❌ Error: Invalid ID');
        return;
      }
      console.log("this.board",this.board);
      
      this.boardService.updateBoard(this.board).subscribe({
        next: () => {
          console.log('✅ Board updated successfully');
          this.router.navigate(['/boards']);
        },
        error: (err) => console.error('❌ Error updating board:', err)
      });
    } else {
      this.boardService.createBoard(this.board).subscribe({
        next: () => {
          console.log('✅ Board created successfully');
          this.router.navigate(['/boards']);
        },
        error: (err) => console.error('❌ Error creating board:', err)
      });
    }
  }
}
