import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  imports:[FormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const user = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(user).subscribe({
      next: () => {
        console.log('User logged in successfully');
        this.router.navigate(['/landing']); 
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed';
      },
    });
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
