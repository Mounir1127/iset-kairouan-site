import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ISET Kairouan';
  currentUser: any = null;
  isAdminRoute = false;
  isMenuOpen = false;

  isLoginPage = false;
  isContactPage = false;
  isFormationsPage = false;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.url.startsWith('/admin') || event.url.startsWith('/staff');
      this.isLoginPage = event.url.includes('/login');
      this.isContactPage = event.url.includes('/contact');
      this.isFormationsPage = event.url.includes('/formations');
      this.isMenuOpen = false; // Close menu on navigation
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  ngOnInit() {
    this.authService.checkAuthStatus();
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
    }
  }

  openStudentSpace() {
    window.open('https://isetkairouan.edx.tn/login.faces', '_blank', 'noopener,noreferrer');
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
