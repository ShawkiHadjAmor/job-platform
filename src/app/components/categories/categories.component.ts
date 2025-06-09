import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';

interface Category {
  id: number;
  name: string;
  createdDate: string;
  lastModifiedDate: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories loaded:', this.categories);
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }
}