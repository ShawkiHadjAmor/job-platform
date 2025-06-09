import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: string | null = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = this.authService.isLoggedIn();
      this.role = this.authService.getRole();
    });
  }
}