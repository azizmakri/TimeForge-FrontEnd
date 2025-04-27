import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {DotLottiePlayer } from '@dotlottie/player-component';


import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AuthInterceptor} from './auth.interceptor';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthService} from './auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, FormsModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Add this interceptor to the chain
    },
    JwtHelperService,  // Register the JwtHelperService
    AuthService        // Register the AuthService
  ],
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'WorkspaceWorkflow';

  constructor(private authService: AuthService,private router: Router) {
  }

  ngOnInit() {
    // Check if the user is authenticated on app load
    this.authService.loadUserFromStorage();
    this.authService.isAuthenticated().subscribe((authenticated) => {
      if (authenticated) {
        console.log('User is authenticated');
      } else {
        console.log('User is not authenticated');
        // Optionally redirect to the login page if not authenticated
        //this.router.navigate(['/login']);
      }
    });
  }
}
