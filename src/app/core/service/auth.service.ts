import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7227/api/auth';
 
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$= this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap(() => {
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/landing']);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Registration error', error);
        return throwError(error); // Return error to be handled elsewhere
      })
    );
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap(() => {
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/landing']);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error', error);
        return throwError(error); // Return error to be handled elsewhere
      })
    );
  }

  checkLogin() {
    this.http.get<boolean>('/IsLoggedIn').subscribe(
      (response) => {
        // console.log(response);
        this.isLoggedInSubject.next(response); // true or false
      },
      () => {
        this.isLoggedInSubject.next(false); // On error, treat as not logged in
      }
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.isLoggedInSubject.next(false); // Set logged out
        this.router.navigate(['/product']);
      })
    );
  }
}
function throwError(error: HttpErrorResponse): any {
  throw new Error('Function not implemented.');
}

