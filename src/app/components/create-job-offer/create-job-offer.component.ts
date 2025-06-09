import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-create-job-offer',
  templateUrl: './create-job-offer.component.html'
})
export class CreateJobOfferComponent implements OnInit {
  jobOfferForm: FormGroup;
  categories: { id: number; name: string }[] = [];

  constructor(private fb: FormBuilder, private jobService: JobService) {
    this.jobOfferForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      salaryRange: ['', Validators.required],
      location: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.jobService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories loaded:', this.categories);
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  createJobOffer(): void {
    if (this.jobOfferForm.valid) {
      const formValue = {
        ...this.jobOfferForm.value,
        category: { id: this.jobOfferForm.value.categoryId }
      };
      this.jobService.createJobOffer(formValue).subscribe({
        next: () => {
          console.log('Job offer created successfully');
          this.jobOfferForm.reset();
        },
        error: (err) => console.error('Error creating job offer:', err)
      });
    }
  }
}