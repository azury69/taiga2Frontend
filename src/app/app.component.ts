import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/service/auth.service';

// import { ProjectLandingComponent } from "./project-landing/project-landing.component";
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "./project/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, HttpClientModule, CommonModule, FormsModule, RouterModule, NavbarComponent], // Include imports if necessary like `CommonModule`, `FormsModule`
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  checkLogin :boolean = false;
  showRegister: boolean = false;  // Default to show login page first
  constructor(private authService: AuthService, private router: Router) {
    this.authService.checkLogin(); // Check login status on app load
    }
  
  ngOnInit() {
    this.authService.checkLogin(); // only call once on app load
    
  }
  toggleRegister() {
      this.showRegister = !this.showRegister;  // Toggle between login and register form
    }
  logout() {
    this.authService.logout();
  }
}
