import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { GoalService } from '../goal/goal.service';

@Component({
  selector: 'app-goal-stats',
  templateUrl: './goal-stats.component.html',
  styleUrl: './goal-stats.component.scss',
  standalone: true,
  imports: []
})
export class GoalStatsComponent implements OnInit {

  stats: any;

  constructor(private goalService: GoalService) {}

  ngOnInit(): void {
    this.goalService.getDashboardStats().subscribe((data) => {
      this.stats = data;
      this.initCharts();
    });
  }

  initCharts(): void {
    if (!this.stats) return;

    if (this.stats.goalsPerMonth) {
      this.createBarChart(
        'goalsPerMonthChart',
        'Goals par Mois',
        Object.keys(this.stats.goalsPerMonth),
        Object.values(this.stats.goalsPerMonth)
      );
    }

    if (this.stats.avgCategoriesPerMonth) {
      this.createLineChart(
        'avgCategoriesPerMonthChart',
        'Moyenne de Catégories par Mois',
        Object.keys(this.stats.avgCategoriesPerMonth),
        Object.values(this.stats.avgCategoriesPerMonth)
      );
    }

    if (this.stats.goalsBySize) {
      this.createPieChart(
        'goalsBySizeChart',
        'Répartition des Goals par Taille',
        Object.keys(this.stats.goalsBySize),
        Object.values(this.stats.goalsBySize)
      );
    }
  }

  createBarChart(id: string, label: string, labels: string[], data: any[]): void {
    new Chart(id, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: '#42A5F5'
        }]
      }
    });
  }

  createLineChart(id: string, label: string, labels: string[], data: any[]): void {
    new Chart(id, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: '#66BB6A',
          fill: false,
        }]
      }
    });
  }

  createPieChart(id: string, label: string, labels: string[], data: any[]): void {
    new Chart(id, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: ['#FFA726', '#AB47BC', '#29B6F6']
        }]
      }
    });
  }
}
