import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
navigateToLogin() {
  this.router.navigate(['/login']);

}
  fullName: string = '';  
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Function to format full name (capitalize first letter of each word)
  formatFullName(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  }

  // Register function
  register() {
    // Trim and format full name
    this.fullName = this.formatFullName(this.fullName);

    // Validate full name format (ensure it has at least two words)
    if (this.fullName.split(' ').length < 2) {
      this.errorMessage = 'Full name must contain both first and last name.';
      return;
    }

    // Validate that passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    
    // Prepare user data
    const user = {
      fullName: this.fullName, // Full name mapped to username
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };
  
    console.log('Registering user with data:', user); // Log data before sending to the backend
  
    // Call the register API
    this.authService.register(user).subscribe(
      (response: any) => {
        console.log('User registered successfully', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed:', error);
        if (error.error && error.error.errors) {
          // Assuming the error response from the backend has an 'errors' property
          let validationErrors = [];
          for (let key in error.error.errors) {
            validationErrors.push(`${key}: ${error.error.errors[key].join(', ')}`);
          }
          this.errorMessage = validationErrors.join(', ');
        } else {
          this.errorMessage = 'Registration failed. Please try again later.';
        }
      }
    );
  }
}
