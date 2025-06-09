import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface RecruiterProfileDTO {
  id: number;
  companyName: string;
  address: string;
  contactPerson: string;
  phone: string;
  description: string;
  logo?: string;
  user: { id: number; email: string; role?: string; createdDate?: string; lastModifiedDate?: string };
  createdDate: string;
  lastModifiedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilerecService {
  private apiUrl = 'http://localhost:8080/api/recruiter';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getRecruiterProfile(): Observable<RecruiterProfileDTO> {
    return this.http.get<RecruiterProfileDTO>(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  getRecruiterProfileById(id: number): Observable<RecruiterProfileDTO> {
    return this.http.get<RecruiterProfileDTO>(`${this.apiUrl}/profile/${id}`, { headers: this.getHeaders() });
  }

  getAllRecruiterProfiles(): Observable<RecruiterProfileDTO[]> {
    return this.http.get<RecruiterProfileDTO[]>(`${this.apiUrl}/profiles`, { headers: this.getHeaders() });
  }

  updateRecruiterProfile(profile: any): Observable<RecruiterProfileDTO> {
    return this.http.put<RecruiterProfileDTO>(`${this.apiUrl}/profile`, profile, { headers: this.getHeaders() });
  }

  updatePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, passwordData, { headers: this.getHeaders() });
  }

  updateEmail(emailData: { currentPassword: string; newEmail: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/email`, emailData, { headers: this.getHeaders() });
  }
}