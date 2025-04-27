import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-strategicparternship',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './strategicparternship.component.html',
  standalone: true,
  styleUrl: './strategicparternship.component.css'
})
export class StrategicparternshipComponent implements OnInit {
  partnerships: any[] = [];
  partnershipForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.partnershipForm = this.fb.group({
      partnername: ['', Validators.required],
      partnershipType: ['', Validators.required],
      offers: ['']
    });
  }

  ngOnInit() {
    this.getPartnerships();
  }

  getPartnerships() {
    this.http.get<any[]>('http://localhost:8100/timeforge/api/partnerships')
    .subscribe(data => this.partnerships = data);
  }

  addPartnership() {
    if (this.partnershipForm.valid) {
      const newPartnership = {
        partnername: this.partnershipForm.value.partnername,
        partnershipType: this.partnershipForm.value.partnershipType,
        offers: this.partnershipForm.value.offers ? this.partnershipForm.value.offers.split(',').map((o: string) => o.trim()) : []
      };

      this.http.post('http://localhost:8100/timeforge/api/partnerships/add', newPartnership)
      .subscribe(() => {
        this.getPartnerships(); // Refresh list after adding
        this.partnershipForm.reset();
      });
    }
  }

  deletePartnership(id: string) {
    if (confirm('Are you sure you want to delete this partnership?')) {
      this.http.delete(`http://localhost:8100/api/partnerships/${id}`)
      .subscribe(() => this.getPartnerships());
    }
  }
}
