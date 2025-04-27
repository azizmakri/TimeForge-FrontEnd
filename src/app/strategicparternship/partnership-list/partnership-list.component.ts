// src/app/components/list-partnership/list-partnership.component.ts
import { Component, OnInit } from '@angular/core';
import { PartnershipService, StrategicPartnership } from '../strategicparternship.service';
import {Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PdfService} from './pdf.service';

@Component({
  selector: 'app-list-partnership',
  templateUrl: 'partnership-list.component.html',
  styleUrls: ['./partnership-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ListPartnershipComponent implements OnInit {
  // Component properties with proper initialization
  partnerships: StrategicPartnership[] = [];
  filteredPartnerships: StrategicPartnership[] = [];
  searchText: string = ''; // Fixes "Unresolved variable or type searchText"
  isLoading: boolean = false; // Fixes "Unresolved variable or type isLoading"
  errorMessage: string | null = null;
  currentPage: number = 1; // Fixes "Unresolved variable or type currentPage"
  itemsPerPage: number = 10; // Fixes "Unresolved variable or type itemsPerPage"
  totalItems: number = 0;
  participantNamesMap: { [id: string]: string } = {};
  constructor(
    private partnershipService: PartnershipService,
    private router: Router,
    private pdfService: PdfService // Assuming you have a PdfService for PDF downloads
  ) {}

  ngOnInit(): void {
    this.loadPartnerships();
  }
  // Add loading state for names
  isLoadingNames: boolean = false;

  loadParticipantNames(participantIds: string[]) {
    if (participantIds.length === 0) return;

    this.isLoadingNames = true;
    this.partnershipService.getNamesByIds(participantIds).subscribe({
      next: (names) => {
        this.participantNamesMap = {...this.participantNamesMap, ...names};
        console.log('Participant names loaded:', this.participantNamesMap);
        this.isLoadingNames = false;
      },
      error: (err) => {
        console.error('Failed to load participant names:', err);
        this.isLoadingNames = false;
      }
    });
  }

  loadPartnerships(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.partnershipService.getAllPartnerships().subscribe({
      next: (partnerships) => {
        console.log("Partnerships loaded:", partnerships);
        this.partnerships = partnerships;
        this.filteredPartnerships = [...partnerships];

        // NEW: Load participant names for all partnerships
        const allParticipantIds = this.getAllUniqueParticipantIds(partnerships);
        this.loadParticipantNames(allParticipantIds);

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }

// NEW: Helper method to get all unique participant IDs
  private getAllUniqueParticipantIds(partnerships: StrategicPartnership[]): string[] {
    const allIds = partnerships.flatMap(p => p.participants);
    return [...new Set(allIds)]; // Remove duplicates
  }
  applyFilter(): void {
    if (!this.searchText.trim()) {
      this.filteredPartnerships = [...this.partnerships];
    } else {
      const searchTerm = this.searchText.toLowerCase().trim();
      this.filteredPartnerships = this.partnerships.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm)) ||
        p.participants.some(participant => participant.toLowerCase().includes(searchTerm))
      );
    }
    this.totalItems = this.filteredPartnerships.length;
    this.currentPage = 1;
  }
  viewDetails(id: string): void {
    this.router.navigate(['/partnerships/edit', id]);
  }
  editPartnership(id: string): void {
    this.router.navigate(['/partnerships/edit', id]);
  }
  deletePartnership(id: string): void {
    if (confirm('Are you sure you want to delete this partnership?')) {
      this.isLoading = true;
      this.partnershipService.deletePartnership(id).subscribe({
        next: () => this.loadPartnerships(),
        error: (err) => {
          console.error('Delete failed', err);
          this.errorMessage = 'Failed to delete partnership';
          this.isLoading = false;
        }
      });
    }
  }

  get paginatedPartnerships(): StrategicPartnership[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPartnerships.slice(startIndex, startIndex + this.itemsPerPage);
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  onPageChange(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }
  trackById(index: number, partnership: StrategicPartnership): string {
    return partnership.id || index.toString();
  }
  downloadPdf(partnershipId: string) {
    this.pdfService.downloadPartnershipPdf(partnershipId).subscribe(
      (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `partnership_${partnershipId}.pdf`;
        link.click();

        window.URL.revokeObjectURL(url);
      },
      error => console.error('PDF download failed', error)
    );
  }
}
