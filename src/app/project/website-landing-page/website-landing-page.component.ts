import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-website-landing-page',
  imports: [],
  templateUrl: './website-landing-page.component.html',
  styleUrl: './website-landing-page.component.css'
})
export class WebsiteLandingPageComponent {
  constructor(private router: Router){}
  navigateToLogin() {
    this.router.navigate(['/login']);
  
  }
}
