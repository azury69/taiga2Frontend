import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7227/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
constructor(private http: HttpClient, private router: Router) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap(() => {
       
        this.router.navigate(['/landing']);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Registration error', error);
        return throwError(() => error); // Return error to be handled elsewhere
      })
    );
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        console.log(response)
        localStorage.setItem('token', response.token);
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/landing']);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error', error);
        return throwError(() => error); 
      })
    );
  }

  checkLogin() {
    const token = localStorage.getItem('token');
  this.isLoggedInSubject.next(!!token);
  if (!token) {
    this.router.navigate(['/product']);
  }
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false); // Set logged out
        this.router.navigate(['/product']);
      })
    );
  }
}
