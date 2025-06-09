import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfilerecService } from 'src/app/services/profilerec.service';
import { ReviewService } from 'src/app/services/review.service';
import { AuthService } from 'src/app/services/auth.service';

interface RecruiterProfileDTO {
  id: number;
  companyName: string;
  address: string;
  phone: string;
  description: string;
  logo?: string;
  user: { id: number; email: string; role?: string; createdDate?: string; lastModifiedDate?: string };
  createdDate: string;
  lastModifiedDate?: string;
}

interface ReviewDTO {
  rating: number;
  comment: string;
  reviewerName: string;
  reviewDate: string;
}

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  company?: RecruiterProfileDTO;
  reviews: ReviewDTO[] = [];
  reviewForm: FormGroup;
  showReviewModal = false;
  toastMessage = '';
  showToast = false;
  selectedRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfilerecService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    const companyId = Number(this.route.snapshot.paramMap.get('id'));
    if (companyId) {
      this.loadCompanyDetails(companyId);
      this.loadReviews(companyId);
    } else {
      console.error('No company ID provided in route');
      this.showErrorToast('Invalid company ID');
    }
  }

  loadCompanyDetails(companyId: number): void {
    this.profileService.getRecruiterProfileById(companyId).subscribe({
      next: (company) => {
        console.log('Company loaded:', company);
        this.company = company;
      },
      error: (err) => {
        console.error('Failed to load company:', err);
        this.showErrorToast('Failed to load company details');
      }
    });
  }

  loadReviews(companyId: number): void {
    this.reviewService.getReviewsForRecruiter(companyId).subscribe({
      next: (reviews) => {
        console.log('Reviews loaded:', reviews);
        this.reviews = reviews || [];
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
        this.showErrorToast('Failed to load reviews');
      }
    });
  }

  openReviewModal(): void {
    if (!this.authService.isLoggedIn()) {
      this.showErrorToast('Please log in to submit a review');
      return;
    }
    if (this.authService.getRole() !== 'ROLE_CANDIDATE') {
      this.showErrorToast('Only candidates can submit reviews');
      return;
    }
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.reviewForm.reset();
    this.selectedRating = 0;
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.get('rating')?.setValue(rating);
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.company) {
      const review = this.reviewForm.value;
      this.reviewService.submitReview(this.company.id, review).subscribe({
        next: () => {
          this.showSuccessToast('Review submitted successfully');
          this.closeReviewModal();
          this.loadReviews(this.company!.id);
        },
        error: (err) => {
          console.error('Error submitting review:', err);
          this.showErrorToast('Error submitting review');
        }
      });
    } else {
      this.showErrorToast('Please fill all required fields correctly');
    }
  }

  getLogoUrl(): string {
    if (!this.company?.logo) {
      return '';
    }
    try {
      return `data:image/png;base64,${this.company.logo}`;
    } catch (err) {
      console.error('Error processing logo:', err);
      this.showErrorToast('Error displaying logo');
      return '';
    }
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