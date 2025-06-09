import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';

interface Application {
  id: number;
  jobOffer: {
    id: number;
    title: string;
    description?: string;
    requirements?: string;
    salaryRange?: string;
    location?: string;
    category?: { id: number; name: string };
    recruiter?: { id: number; companyName?: string };
    postedDate?: string;
    lastModifiedDate?: string;
  };
  coverLetter?: string;
  status: string;
  applicationDate: string;
  lastModifiedDate?: string;
}

@Component({
  selector: 'app-applied-jobs',
  templateUrl: './applied-jobs.component.html'
})
export class AppliedJobsComponent implements OnInit {
  applications: Application[] = [];
  selectedJob: Application['jobOffer'] | null = null;
  showJobDetailsModal = false;

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.jobService.getCandidateApplications().subscribe({
      next: (applications: any[]) => {
        this.applications = applications.map((app: any) => ({
          id: app.id,
          jobOffer: {
            id: app.jobOffer?.id || app.jobOfferId || 0,
            title: app.jobOffer?.title || 'Unknown',
            description: app.jobOffer?.description,
            requirements: app.jobOffer?.requirements,
            salaryRange: app.jobOffer?.salaryRange,
            location: app.jobOffer?.location,
            category: app.jobOffer?.category,
            recruiter: app.jobOffer?.recruiter,
            postedDate: app.jobOffer?.postedDate,
            lastModifiedDate: app.jobOffer?.lastModifiedDate
          },
          coverLetter: app.coverLetter,
          status: app.status || 'Unknown',
          applicationDate: app.applicationDate || '',
          lastModifiedDate: app.lastModifiedDate
        }));
      },
      error: (err) => this.showToast('Failed to load applications: ' + err.message)
    });
  }

  viewJobDetails(jobId: number) {
    this.jobService.getJobOfferById(jobId).subscribe({
      next: (data: any) => {
        this.selectedJob = {
          id: data.id,
          title: data.title || 'Unknown',
          description: data.description,
          requirements: data.requirements,
          salaryRange: data.salaryRange,
          location: data.location,
          category: data.category,
          recruiter: data.recruiter,
          postedDate: data.postedDate,
          lastModifiedDate: data.lastModifiedDate
        };
        this.showJobDetailsModal = true;
      },
      error: (err) => this.showToast('Failed to load job details: ' + err.message)
    });
  }

  getFormattedDate(date: string | undefined): string {
    return date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified';
  }

  closeJobDetailsModal() {
    this.showJobDetailsModal = false;
    this.selectedJob = null;
  }

  showToast(message: string) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.remove('hidden');
      toast.classList.add(message.includes('failed') ? 'bg-red-500' : 'bg-green-500');
      setTimeout(() => toast.classList.add('hidden'), 3000);
    }
  }
}