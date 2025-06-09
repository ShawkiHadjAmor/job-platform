import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-offers',
  templateUrl: './view-all-offers.component.html'
})
export class ViewAllOffersComponent implements OnInit {
  jobs: any[] = [];

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.jobService.getRecruiterJobOffers().subscribe({
      next: (jobs) => this.jobs = jobs,
      error: (err) => console.error('Error loading jobs:', err)
    });
  }

  viewOfferDetails(id: number) {
    this.router.navigate([`/recruiter/job-offer/${id}`]);
  }

  deleteJobOffer(id: number) {
    this.jobService.deleteJobOffer(id).subscribe({
      next: () => this.loadJobs(),
      error: (err) => console.error('Error deleting job:', err)
    });
  }
}