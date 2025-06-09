import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  host: {
    'class': 'login-host'
  }
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.errorMessage = null;
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (response) => {
          if (response.role === 'ROLE_CANDIDATE') {
            this.router.navigate(['/candidate-dashboard']);
          } else if (response.role === 'ROLE_RECRUITER') {
            this.router.navigate(['/recruiter-dashboard']);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          if (err.status === 401 || err.error?.message?.includes('Bad credentials')) {
            this.errorMessage = 'Invalid Credentials';
          } else {
            this.errorMessage = 'Login failed: ' + (err.error?.message || 'Unknown error');
          }
        }
      });
    }
  }
}