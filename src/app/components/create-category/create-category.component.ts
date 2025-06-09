import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html'
})
export class CreateCategoryComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(private fb: FormBuilder, private jobService: JobService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  createCategory(): void {
    if (this.categoryForm.valid) {
      this.jobService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          console.log('Category created successfully');
          this.categoryForm.reset();
        },
        error: (err: any) => console.error('Error creating category:', err)
      });
    }
  }
}