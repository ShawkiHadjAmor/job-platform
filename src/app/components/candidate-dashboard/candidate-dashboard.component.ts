import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-dashboard',
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent implements OnInit {
  jobs: any[] = [];
  filteredJobs: any[] = [];
  searchTerms = new Subject<string>();
  selectedJob: any = null;
  showJobDetailsModal = false;
  showApplyModal = false;
  coverLetterFile: File | null = null;

  constructor(
    private jobService: JobService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.jobService.getAllJobOffers().subscribe({
      next: (data) => {
        this.jobs = data;
        this.filteredJobs = data;
      },
      error: (err) => this.showToast('Failed to load jobs: ' + err.message)
    });

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => term ? this.jobService.searchJobOffers(term) : this.jobService.getAllJobOffers())
    ).subscribe({
      next: (data) => this.filteredJobs = data,
      error: (err) => this.showToast('Search failed: ' + err.message)
    });
  }

  searchJobs(term: string) {
    this.searchTerms.next(term);
  }

  openJobDetails(job: any) {
    this.selectedJob = job;
    this.showJobDetailsModal = true;
  }

  closeJobDetailsModal() {
    this.showJobDetailsModal = false;
    this.selectedJob = null;
  }

  openApplyModal(job: any) {
    this.selectedJob = job;
    this.showApplyModal = true;
  }

  closeApplyModal() {
    this.showApplyModal = false;
    this.selectedJob = null;
    this.coverLetterFile = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.coverLetterFile = input.files[0];
    }
  }

  applyForJob() {
    if (!this.selectedJob || !this.coverLetterFile) {
      this.showToast('Please select a cover letter file.');
      return;
    }

    const formData = new FormData();
    formData.append('jobOfferId', this.selectedJob.id.toString());
    formData.append('coverLetterFile', this.coverLetterFile);

    this.jobService.applyForJob(this.selectedJob.id, formData).subscribe({
      next: () => {
        this.showToast('Application submitted successfully!');
        this.closeApplyModal();
      },
      error: (err) => {
        console.error('Apply for job error:', err);
        this.showToast('Application failed: ' + (err.error?.message || err.message));
      }
    });
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