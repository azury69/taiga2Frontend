// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../service/auth.service'; // Import the AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      take(1), // Take only the latest value
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return true; // Allow access
        } else {
          this.router.navigate(['/login']); // Redirect if not logged in
          return false;
        }
      })
    );
  }
}
