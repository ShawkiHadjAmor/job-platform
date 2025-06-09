import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/candidate';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getCandidateProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  updateCandidateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profileData, { headers: this.getHeaders() });
  }

  updateEmail(emailData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/email`, emailData, { headers: this.getHeaders() });
  }

  updatePassword(passwordData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, passwordData, { headers: this.getHeaders() });
  }

  addEducation(educationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/education`, educationData, { headers: this.getHeaders() });
  }

  updateEducation(id: number, educationData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/education/${id}`, educationData, { headers: this.getHeaders() });
  }

  deleteEducation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/education/${id}`, { headers: this.getHeaders() });
  }

  addExperience(experienceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/experience`, experienceData, { headers: this.getHeaders() });
  }

  updateExperience(id: number, experienceData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/experience/${id}`, experienceData, { headers: this.getHeaders() });
  }

  deleteExperience(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/experience/${id}`, { headers: this.getHeaders() });
  }

  addSkill(skillData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/skill`, skillData, { headers: this.getHeaders() });
  }

  updateSkill(id: number, skillData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/skill/${id}`, skillData, { headers: this.getHeaders() });
  }

  deleteSkill(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/skill/${id}`, { headers: this.getHeaders() });
  }

  getEducations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/educations`, { headers: this.getHeaders() });
  }

  getExperiences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/experiences`, { headers: this.getHeaders() });
  }

  getSkills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/skills`, { headers: this.getHeaders() });
  }

  getCandidateById(candidateId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/candidate/${candidateId}/cv`, { headers: this.getHeaders() });
  }
   getCandidateCv(candidateId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/candidate/${candidateId}/cv`, { headers: this.getHeaders() });
  }
}