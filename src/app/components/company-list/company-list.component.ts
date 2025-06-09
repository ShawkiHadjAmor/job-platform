import { Component, OnInit } from '@angular/core';
import { ProfilerecService } from 'src/app/services/profilerec.service';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies: RecruiterProfileDTO[] = [];

  constructor(
    private profileService: ProfilerecService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.profileService.getAllRecruiterProfiles().subscribe({
      next: (companies) => {
        console.log('Companies received:', companies); // Debug to check data
        this.companies = companies || []; // Ensure array even if null
      },
      error: (err) => {
        console.error('Failed to load companies:', err);
        this.companies = []; // Reset on error
      }
    });
  }

  viewCompanyDetails(companyId: number): void {
    this.router.navigate([`/company-details/${companyId}`]);
  }
}