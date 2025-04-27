import {Component, OnInit} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {ProjectService} from '../project/project.service';

Chart.register(...registerables);

@Component({
  selector: 'app-project-stats',
  standalone: true,
  imports: [],
  templateUrl: './project-stats.component.html',
  styleUrl: './project-stats.component.scss'
})
export class ProjectStatsComponent implements OnInit {

  stats: any;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjectDashboardStats().subscribe((data) => {
      this.stats = data;
      this.initCharts();
    });
  }

  initCharts() {
    this.createBarChart(
      'projectsPerMonthChart',
      'Projects per Month',
      Object.keys(this.stats.projectsPerMonth),
      Object.values(this.stats.projectsPerMonth)
    );

    this.createLineChart(
      'averageMembersPerMonthChart',
      'Average Members per Month',
      Object.keys(this.stats.averageMembersPerMonth),
      Object.values(this.stats.averageMembersPerMonth)
    );

    this.createPieChart(
      'projectsBySizeChart',
      'Projects by Size',
      Object.keys(this.stats.projectsBySize),
      Object.values(this.stats.projectsBySize)
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
