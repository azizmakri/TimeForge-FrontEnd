import {Component, OnInit} from '@angular/core';
import {GoalService} from '../goal/goal.service';
import {ProjectService} from '../project/project.service';
import {WorkflowService} from '../workflow/workflow.service';
import {PartnershipService} from '../strategicparternship/strategicparternship.service';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-all-stats',
  imports: [],
  templateUrl: './all-stats.component.html',
  standalone: true,
  styleUrl: './all-stats.component.scss'
})
export class AllStatsComponent implements OnInit {

  stats: any;

  // Inject services
  constructor(
    private goalService: GoalService,
    private projectService: ProjectService,
    private workflowService: WorkflowService,
    private partnershipService: PartnershipService
  ) {}

  ngOnInit(): void {
    // Fetch data from GoalService and initialize charts
    this.goalService.getDashboardStats().subscribe((data) => {
      this.stats = data;
      this.initGoalCharts();
    });

    // Fetch data from ProjectService and initialize charts
    this.projectService.getProjectDashboardStats().subscribe((data) => {
      this.stats = data;
      this.initProjectCharts();
    });

    // Fetch data from WorkflowService and initialize charts
    this.workflowService.getDashboardStats().subscribe((data) => {
      this.stats = data;
      this.initWorkflowCharts();
    });

    // Fetch data from PartnershipService and initialize charts
    this.partnershipService.getDashboardStats().subscribe((data) => {
      this.stats = data;
      this.initPartnershipCharts();
    });
  }

  // Initialize charts for GoalStats
  initGoalCharts(): void {
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

  // Initialize charts for ProjectStats
  initProjectCharts(): void {
    if (!this.stats) return;

    if (this.stats.projectsPerMonth) {
      this.createBarChart(
        'projectsPerMonthChart',
        'Projects par Mois',
        Object.keys(this.stats.projectsPerMonth),
        Object.values(this.stats.projectsPerMonth)
      );
    }

    if (this.stats.projectCategories) {
      this.createLineChart(
        'projectCategoriesChart',
        'Catégories de Projet par Mois',
        Object.keys(this.stats.projectCategories),
        Object.values(this.stats.projectCategories)
      );
    }

    if (this.stats.projectsBySize) {
      this.createPieChart(
        'projectsBySizeChart',
        'Répartition des Projects par Taille',
        Object.keys(this.stats.projectsBySize),
        Object.values(this.stats.projectsBySize)
      );
    }
  }

  // Initialize charts for WorkflowStats
  initWorkflowCharts(): void {
    if (!this.stats) return;

    if (this.stats.workflowsPerMonth) {
      this.createBarChart(
        'workflowsPerMonthChart',
        'Workflows par Mois',
        Object.keys(this.stats.workflowsPerMonth),
        Object.values(this.stats.workflowsPerMonth)
      );
    }

    if (this.stats.workflowCategories) {
      this.createLineChart(
        'workflowCategoriesChart',
        'Catégories de Workflow par Mois',
        Object.keys(this.stats.workflowCategories),
        Object.values(this.stats.workflowCategories)
      );
    }

    if (this.stats.workflowsBySize) {
      this.createPieChart(
        'workflowsBySizeChart',
        'Répartition des Workflows par Taille',
        Object.keys(this.stats.workflowsBySize),
        Object.values(this.stats.workflowsBySize)
      );
    }
  }

  // Initialize charts for PartnershipStats
  initPartnershipCharts(): void {
    if (!this.stats) return;

    if (this.stats.partnershipsPerMonth) {
      this.createBarChart(
        'partnershipsPerMonthChart',
        'Partenariats par Mois',
        Object.keys(this.stats.partnershipsPerMonth),
        Object.values(this.stats.partnershipsPerMonth)
      );
    }

    if (this.stats.partnershipCategories) {
      this.createLineChart(
        'partnershipCategoriesChart',
        'Catégories de Partenariat par Mois',
        Object.keys(this.stats.partnershipCategories),
        Object.values(this.stats.partnershipCategories)
      );
    }

    if (this.stats.partnershipsBySize) {
      this.createPieChart(
        'partnershipsBySizeChart',
        'Répartition des Partenariats par Taille',
        Object.keys(this.stats.partnershipsBySize),
        Object.values(this.stats.partnershipsBySize)
      );
    }
  }

  // Bar chart creation method
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

  // Line chart creation method
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

  // Pie chart creation method
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
