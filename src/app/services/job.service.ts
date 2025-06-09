import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface StatsByCategory {
  category: string;
  count: number;
}

interface StatusByCategory {
  category: string;
  pending: number;
  underReview: number;
  interview: number;
  offered: number;
  rejected: number;
}

interface JobOffer {
  id: number;
  title: string;
  description: string;
  requirements: string;
  salaryRange: string;
  location: string;
  category: { id: number; name: string };
  recruiter: { id: number; companyName?: string };
  postedDate: string;
  lastModifiedDate: string;
}

interface JobOfferWithApplications {
  jobOffer: JobOffer;
  applications: {
    id: number;
    candidate: { id: number; name: string };
    coverLetter: string;
    status: string;
    applicationDate: string;
    lastModifiedDate: string;
  }[];
}

interface Category {
  id: number;
  name: string;
  createdDate: string;
  lastModifiedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('No token found, API requests may fail');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getAllJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/job-offers`, { headers: this.getHeaders() });
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, { headers: this.getHeaders() });
  }

  applyForJob(jobOfferId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/candidate/apply`, formData, { headers: this.getHeaders() });
  }

  sendCandidateCv(jobOfferId: number, candidateId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/recruiter/job-offer/${jobOfferId}/candidate/${candidateId}/cv`, {}, { headers: this.getHeaders() });
  }

  searchJobOffers(keyword: string): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/job-offers/search?keyword=${encodeURIComponent(keyword)}`, { headers: this.getHeaders() });
  }

  getCandidateApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/candidate/applications`, { headers: this.getHeaders() });
  }

  createJobOffer(jobOffer: any): Observable<JobOffer> {
    return this.http.post<JobOffer>(`${this.apiUrl}/recruiter/job-offer`, jobOffer, { headers: this.getHeaders() });
  }

  getRecruiterJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/recruiter/job-offers/applications`, { headers: this.getHeaders() });
  }

  getApplicationsForJob(jobOfferId: number): Observable<JobOfferWithApplications> {
    return this.http.get<JobOfferWithApplications>(`${this.apiUrl}/recruiter/job-offer/${jobOfferId}/applications`, { headers: this.getHeaders() });
  }

  updateApplicationStatus(applicationId: number, status: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/recruiter/application/${applicationId}/status`, status, { headers: this.getHeaders() });
  }

  deleteJobOffer(jobOfferId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/recruiter/job-offer/${jobOfferId}`, { headers: this.getHeaders() });
  }

  getApplicationsByCategory(): Observable<StatsByCategory[]> {
    return this.http.get<StatsByCategory[]>(`${this.apiUrl}/recruiter/job-offers/stats/by-category`, { headers: this.getHeaders() });
  }

  getStatusByCategory(): Observable<StatusByCategory[]> {
    return this.http.get<StatusByCategory[]>(`${this.apiUrl}/recruiter/job-offers/stats/status-by-category`, { headers: this.getHeaders() });
  }

  createCategory(category: { name: string }): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category, { headers: this.getHeaders() });
  }

  getJobOfferById(jobOfferId: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/job-offers/${jobOfferId}`, { headers: this.getHeaders() });
  }

  getJobOffersByCategory(): Observable<StatsByCategory[]> {
    return this.http.get<StatsByCategory[]>(`${this.apiUrl}/recruiter/job-offers/stats/offers-by-category`, { headers: this.getHeaders() });
  }

  getApplicationTrends(): Observable<{ month: string; count: number }[]> {
    return this.http.get<{ month: string; count: number }[]>(`${this.apiUrl}/recruiter/job-offers/stats/application-trends`, { headers: this.getHeaders() });
  }
}