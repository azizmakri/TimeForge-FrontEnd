import {Component, OnInit} from '@angular/core';
import {WorkflowService} from '../workflow/workflow.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  standalone: true,
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  stats: any;

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.workflowService.getDashboardStats().subscribe((data) => {
      this.stats = data;
      this.initCharts();
    });
  }

  initCharts() {
    this.createBarChart(
      'workflowsPerMonthChart',
      'Workflows par Mois',
      Object.keys(this.stats.workflowsPerMonth),
      Object.values(this.stats.workflowsPerMonth)
    );

    this.createLineChart(
      'averageStepsPerMonthChart',
      'Moyenne des Étapes par Mois',
      Object.keys(this.stats.averageStepsPerMonth),
      Object.values(this.stats.averageStepsPerMonth)
    );

    this.createPieChart(
      'workflowsBySizeChart',
      'Répartition des Workflows par Taille',
      Object.keys(this.stats.workflowsBySize),
      Object.values(this.stats.workflowsBySize)
    );
  }

  createBarChart(id: string, label: string, labels: string[], data: any[]) {
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

  createLineChart(id: string, label: string, labels: string[], data: any[]) {
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

  createPieChart(id: string, label: string, labels: string[], data: any[]) {
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
