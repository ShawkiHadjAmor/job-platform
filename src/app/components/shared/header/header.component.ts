import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/recruiter-dashboard/profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}