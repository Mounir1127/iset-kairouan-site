import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-wrapper" [class.sidebar-hidden]="isCollapsed">
      <aside class="admin-sidebar" [class.collapsed]="isCollapsed">
        <div class="sidebar-header">
          <div class="logo-icon">IK</div>
          <div class="logo-text">ADMIN Pro</div>
        </div>
        
        <nav class="sidebar-nav">
          <span class="menu-label">Principal</span>
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
            <i class="fas fa-th-large"></i>
            <span>Tableau de bord</span>
          </a>
          
          <span class="menu-label">Gestion</span>
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
            <i class="fas fa-users-cog"></i>
            <span>Utilisateurs</span>
          </a>
          <a routerLink="/admin/structure" routerLinkActive="active" class="nav-item">
            <i class="fas fa-sitemap"></i>
            <span>Structure</span>
          </a>
          <a routerLink="/admin/academic" routerLinkActive="active" class="nav-item">
            <i class="fas fa-graduation-cap"></i>
            <span>Académique</span>
          </a>
          
          <span class="menu-label">Communication</span>
          <a routerLink="/admin/news" routerLinkActive="active" class="nav-item">
            <i class="fas fa-newspaper"></i>
            <span>Actualités</span>
          </a>
          <a routerLink="/admin/messages" routerLinkActive="active" class="nav-item">
            <i class="fas fa-envelope-open-text"></i>
            <span>Messages</span>
          </a>
          
          <div class="nav-divider"></div>
          <a routerLink="/" class="nav-item return-site">
            <i class="fas fa-external-link-alt"></i>
            <span>Retour au site</span>
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <button (click)="logout()" class="logout-btn">
            <i class="fas fa-power-off"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main class="admin-main">
        <header class="admin-header">
          <div class="header-left">
            <button class="toggle-btn" (click)="toggleSidebar()">
              <i class="fas" [class.fa-bars]="!isCollapsed" [class.fa-arrow-right]="isCollapsed"></i>
            </button>
            <h2 class="page-title">Système d'administration</h2>
          </div>
          
          <div class="header-right">
            <button class="quick-add-btn" title="Nouveau" routerLink="/admin/news">
              <i class="fas fa-plus"></i>
              <span>Publier</span>
            </button>
            <div class="user-info">
              <div class="user-details">
                <span class="username">{{ currentUser?.name || 'Administrateur' }}</span>
                <span class="role-badge">{{ currentUser?.role || 'Admin' }}</span>
              </div>
              <div class="admin-avatar">
                {{ (currentUser?.name || 'A').charAt(0) }}
              </div>
            </div>
          </div>
        </header>

        <section class="admin-content">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  isCollapsed = false;
  currentUser: any;

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
  }
}
