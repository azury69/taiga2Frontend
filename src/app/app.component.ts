import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/service/auth.service';

// import { ProjectLandingComponent } from "./project-landing/project-landing.component";
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf,HttpClientModule,CommonModule,FormsModule,RouterModule], // Include imports if necessary like `CommonModule`, `FormsModule`
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn :boolean = false;
  showRegister: boolean = false;  // Default to show login page first

  toggleRegister() {
    this.showRegister = !this.showRegister;  // Toggle between login and register form
  }
  constructor(private authService: AuthService, private router: Router) {
    
  }
  ngOnInit() {
    this.authService.checkLogin(); // only call once on app load

  }
  logout() {
    this.authService.logout().subscribe(() => {
      this.isLoggedIn = false;
      this.router.navigate(['/product']);
    });
  }
}
