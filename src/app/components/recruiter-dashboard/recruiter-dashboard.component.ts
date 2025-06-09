import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent implements AfterViewInit {
  @ViewChild('applications') applicationsChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusDistributionChart') statusDistributionChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('offersByCategory') offersByCategoryChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('applicationTrends') applicationTrendsChartCanvas!: ElementRef<HTMLCanvasElement>;
  jobs: any[] = [];

  constructor(
    private jobService: JobService,
    public authService: AuthService,
    private router: Router
  ) {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    if (!this.authService.isLoggedIn()) {
      console.warn('User not logged in, redirecting to login');
      this.router.navigate(['']);
      return;
    }
    this.loadJobs();
    setTimeout(() => this.loadCharts(), 0);
  }

  loadJobs() {
    this.jobService.getRecruiterJobOffers().subscribe({
      next: (jobs) => this.jobs = jobs,
      error: (err) => console.error('Error loading jobs:', err)
    });
  }

  loadCharts() {
    if (!this.applicationsChartCanvas?.nativeElement || !this.statusDistributionChartCanvas?.nativeElement ||
        !this.offersByCategoryChartCanvas?.nativeElement || !this.applicationTrendsChartCanvas?.nativeElement) {
      console.warn('Chart canvases not found in DOM');
      return;
    }

    // Applications by Category
    this.jobService.getApplicationsByCategory().subscribe({
      next: (data) => {
        const labels = data.map((item: any) => item.category);
        const counts = data.map((item: any) => item.count);
        new Chart(this.applicationsChartCanvas.nativeElement, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Applications',
              data: counts,
              backgroundColor: '#3A59D1',
              borderColor: '#2a47a0',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } },
            plugins: { legend: { display: false } }
          }
        });
      },
      error: (err) => console.error('Failed to load applications by category:', err)
    });

    // Status Distribution
    this.jobService.getStatusByCategory().subscribe({
      next: (data) => {
        const statuses = ['PENDING', 'UNDER_REVIEW', 'INTERVIEW', 'OFFERED', 'REJECTED'];
        const counts = statuses.map(status =>
          data.reduce((sum: number, item: any) => sum + (item[status.toLowerCase().replace('_', '')] || 0), 0)
        );
        new Chart(this.statusDistributionChartCanvas.nativeElement, {
          type: 'pie',
          data: {
            labels: statuses,
            datasets: [{
              data: counts,
              backgroundColor: statuses.map(status => this.getStatusColor(status)),
              borderColor: '#ffffff',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 8 } } } }
          }
        });
      },
      error: (err) => console.error('Failed to load status by category:', err)
    });

    // Job Offers by Category
    this.jobService.getJobOffersByCategory().subscribe({
      next: (data) => {
        const labels = data.map((item: any) => item.category);
        const counts = data.map((item: any) => item.count);
        new Chart(this.offersByCategoryChartCanvas.nativeElement, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Offers',
              data: counts,
              backgroundColor: '#388E3C',
              borderColor: '#2e7d32',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } },
            plugins: { legend: { display: false } }
          }
        });
      },
      error: (err) => console.error('Failed to load job offers by category:', err)
    });

    // Application Trends
    this.jobService.getApplicationTrends().subscribe({
      next: (data) => {
        const labels = data.map((item: any) => item.month);
        const counts = data.map((item: any) => item.count);
        new Chart(this.applicationTrendsChartCanvas.nativeElement, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Applications',
              data: counts,
              borderColor: '#0277bd',
              borderWidth: 2,
              pointRadius: 3,
              fill: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } },
            plugins: { legend: { display: false } }
          }
        });
      },
      error: (err) => console.error('Failed to load application trends:', err)
    });
  }

  viewOfferDetails(id: number) {
    this.router.navigate([`/recruiter-dashboard/offer/${id}`]);
  }

  deleteJobOffer(id: number) {
    this.jobService.deleteJobOffer(id).subscribe({
      next: () => this.loadJobs(),
      error: (err) => console.error('Error deleting job:', err)
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return '#FFB300';
      case 'UNDER_REVIEW': return '#1976D2';
      case 'INTERVIEW': return '#0288D1';
      case 'OFFERED': return '#388E3C';
      case 'REJECTED': return '#D32F2F';
      default: return '#3A59D1';
    }
  }
}