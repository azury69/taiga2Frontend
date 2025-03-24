import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';  // Import JWT decode for decoding the token

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');  // Retrieve token from storage

    // If token is available, check if it's expired, if not, attach to the request
    if (token) {
      const decodedToken: any = jwtDecode(token); // Decode the JWT token to get its expiration
      const tokenExpiration = decodedToken?.exp * 1000;  // Convert from seconds to milliseconds
      const currentTime = Date.now();
      console.log('Token expiration time:', new Date(tokenExpiration));  // Debugging
      console.log('Current time:', new Date(currentTime));  // Debugging
      if (tokenExpiration > currentTime) {
        // Token is still valid, add it to the request headers
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}` // Attach token as Authorization header
          }
        });      
        console.log('Cloned request headers:', clonedRequest.headers);  // Debugging
        return next.handle(clonedRequest);
      } else {
        // Token is expired, optionally log out or refresh token (you can handle this if needed)
        console.log('Token is expired');
        // Optionally, clear the token from localStorage and perform a logout or refresh
        localStorage.removeItem('token');
      }
    }

    return next.handle(req);  // Proceed without the token if not available or expired
  }
}
