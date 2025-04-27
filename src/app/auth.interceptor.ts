import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private jwtHelper: JwtHelperService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding token for public endpoints (adjust this part as needed)
    if (request.url.includes('/auth/') ||
      request.url.includes('/api/partnerships') &&
      (request.method === 'POST' || request.url.includes('/verify'))) {
      return next.handle(request);
    }

    // Add Authorization token for requests that require authentication
    const token = localStorage.getItem('jwtToken');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      // Handle token expiration or missing token here, e.g., redirect to login
    }

    return next.handle(request);
  }
}

