import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PartnershipService } from '../strategicparternship/strategicparternship.service';

@Component({
  selector: 'app-strategic-partenership-stats',
  templateUrl: './strategic-partenership-stats.component.html',
  styleUrl: './strategic-partenership-stats.component.scss',
  standalone: true,
  imports: []
})
export class StrategicPartenershipStatsComponent implements OnInit {

  stats: any;

  constructor(private partnershipService: PartnershipService) {}

  ngOnInit(): void {
    this.partnershipService.getDashboardStats().subscribe((data) => {
      this.stats = data;

      // On attend le rendu du DOM (canvas inclus) avant de créer les charts
      setTimeout(() => {
        this.initCharts();
      }, 0);
    });
  }

  initCharts() {
    this.createBarChart(
      'partnershipsPerMonthChart',
      'Partenariats par Mois',
      Object.keys(this.stats.partnershipsPerMonth || {}),
      Object.values(this.stats.partnershipsPerMonth || {})
    );

    this.createLineChart(
      'participantsPerMonthChart',
      'Participants par Mois',
      Object.keys(this.stats.avgParticipantsPerMonth || {}),
      Object.values(this.stats.avgParticipantsPerMonth || {})
    );

    this.createPieChart(
      'participantsBySizeChart',
      'Répartition des Participants par Taille',
      Object.keys(this.stats.partnershipsBySize || {}),
      Object.values(this.stats.partnershipsBySize || {})
    );
  }

  createBarChart(id: string, label: string, labels: string[], data: any[]) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: '#42A5F5'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createLineChart(id: string, label: string, labels: string[], data: any[]) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;
    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: '#66BB6A',
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createPieChart(id: string, label: string, labels: string[], data: any[]) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;
    new Chart(canvas, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: ['#FFA726', '#AB47BC', '#29B6F6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
