import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService {
  constructor(private http: HttpClient) {}

  checkEmail(email: string): Observable<boolean> {
    return this.http.get(`http://localhost:8080/api/auth/check-email?email=${email}`).pipe(
      map((response: any) => response.exists)
    );
  }
}