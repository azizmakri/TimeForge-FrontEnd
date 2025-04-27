import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']); // Redirect to dashboard if logged in
          return false; // Block access to login page
        }
        return true; // Allow access if not authenticated
      })
    );
  }
}
