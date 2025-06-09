import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface ReviewDTO {
  rating: number;
  comment: string;
  reviewerName: string;
  reviewDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getReviewsForRecruiter(recruiterId: number): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.apiUrl}/${recruiterId}`, { headers: this.getHeaders() });
  }

  submitReview(recruiterId: number, review: { rating: number; comment: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${recruiterId}`, review, { headers: this.getHeaders() });
  }
}