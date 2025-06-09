import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {
  jobOffer: any = {};
  applications: any[] = [];
  statusForm: FormGroup;
  selectedApplication: any | null = null;
  showCvModal: boolean = false;
  showStatusModal: boolean = false;
  showCoverLetterModal: boolean = false;
  selectedCoverLetter: string | null = null;
  toastMessage: string = '';
  showToast: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.statusForm = this.fb.group({
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const offerId = this.route.snapshot.paramMap.get('id');
    if (offerId) {
      this.jobService.getApplicationsForJob(+offerId).subscribe({
        next: (data: { jobOffer: any; applications: any[] }) => {
          this.jobOffer = data.jobOffer;
          this.applications = data.applications.map(app => ({
            ...app,
            candidate: {
              id: app.candidate.id,
              name: app.candidate?.name || 'Unknown',
              socialMediaLinks: app.candidate?.socialMediaLinks || []
            }
          }));
        },
        error: (err) => {
          console.error('Failed to load job offer:', err);
          this.showErrorToast('Failed to load job offer data');
        }
      });
    }
  }

  openStatusModal(application: any): void {
    this.selectedApplication = application;
    this.statusForm.patchValue({ status: application.status });
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedApplication = null;
  }

  updateApplicationStatus(): void {
    if (this.statusForm.valid && this.selectedApplication) {
      const status = this.statusForm.value.status;
      this.jobService.updateApplicationStatus(this.selectedApplication.id, { status }).subscribe({
        next: () => {
          const app = this.applications.find(a => a.id === this.selectedApplication.id);
          if (app) app.status = status;
          this.showSuccessToast('Application status updated successfully');
          this.closeStatusModal();
        },
        error: (err) => {
          console.error('Failed to update status:', err);
          this.showErrorToast('Failed to update application status');
        }
      });
    } else {
      this.showErrorToast('Please select a valid status');
    }
  }

  openCvModal(application: any): void {
    this.selectedApplication = application;
    this.showCvModal = true;
  }

  closeCvModal(): void {
    this.showCvModal = false;
    this.selectedApplication = null;
  }

  openCoverLetterModal(coverLetter: string): void {
    if (coverLetter) {
      this.selectedCoverLetter = coverLetter;
      this.showCoverLetterModal = true;
    } else {
      this.showErrorToast('No cover letter available');
    }
  }

  closeCoverLetterModal(): void {
    this.showCoverLetterModal = false;
    this.selectedCoverLetter = null;
  }

  getCoverLetterUrl(): SafeUrl | null {
    if (this.selectedCoverLetter) {
      const dataUrl = `data:application/pdf;base64,${this.selectedCoverLetter}`;
      return this.sanitizer.bypassSecurityTrustUrl(dataUrl);
    }
    return null;
  }

  showSuccessToast(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  showErrorToast(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }
}