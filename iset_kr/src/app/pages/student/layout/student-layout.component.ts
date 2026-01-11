import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-student-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="student-wrapper" [class.sidebar-hidden]="isCollapsed">
      <!-- SIDEBAR ULTRA PRO -->
      <aside class="student-sidebar" [class.collapsed]="isCollapsed">
        <div class="sidebar-header">
          <div class="logo-wrap">
            <div class="logo-icon">IS</div>
            <div class="logo-text">STUDENT<span>PRO</span></div>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="section-label">Principal</span>
            <a routerLink="/student/dashboard" routerLinkActive="active" class="nav-item">
              <i class="fas fa-home"></i>
              <span>Mon Espace</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="section-label">Académique</span>
            <a routerLink="/student/schedule" routerLinkActive="active" class="nav-item">
              <i class="fas fa-calendar-alt"></i>
              <span>Emploi du Temps</span>
            </a>
            <a routerLink="/student/grades" routerLinkActive="active" class="nav-item">
              <i class="fas fa-star"></i>
              <span>Mes Notes</span>
            </a>
            <a routerLink="/student/materials" routerLinkActive="active" class="nav-item">
              <i class="fas fa-folder-open"></i>
              <span>Cours & Supports</span>
            </a>
          </div>

          <div class="nav-divider"></div>
          <a routerLink="/" class="nav-item back-home">
            <i class="fas fa-arrow-left"></i>
            <span>Retour au portail</span>
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <div class="user-quick-profile">
            <div class="avatar">{{ (currentUser?.name || 'S').charAt(0) }}</div>
            <div class="info">
              <span class="name">{{ currentUser?.name }}</span>
              <span class="role">Étudiant</span>
            </div>
            <button (click)="logout()" class="btn-logout" title="Déconnexion">
              <i class="fas fa-power-off"></i>
            </button>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="student-main">
        <section class="student-content-area">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
    styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    
    :host {
      --primary: #0055a4;
      --secondary: #f59e0b;
      --navy: #0f172a;
      --light-blue: #eff6ff;
      --sidebar-width: 280px;
      --sidebar-collapsed: 85px;
      --header-height: 80px;
      --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .student-wrapper {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
      font-family: 'Outfit', sans-serif;
    }

    /* SIDEBAR STYLES */
    .student-sidebar {
      width: var(--sidebar-width);
      background: var(--navy);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      transition: var(--transition);
      box-shadow: 10px 0 30px rgba(15, 23, 42, 0.1);
    }

    .sidebar-header {
      padding: 2.5rem 1.5rem;
      .logo-wrap {
        display: flex;
        align-items: center;
        gap: 1rem;
        
        .logo-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, var(--primary), #0077c8);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.4rem;
          color: white;
          box-shadow: 0 8px 16px rgba(0, 85, 164, 0.3);
        }
        
        .logo-text {
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: -0.5px;
          span { color: var(--secondary); margin-left: 2px; }
        }
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 0 1rem;
      overflow-y: auto;
      
      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

      .nav-section {
        margin-bottom: 2rem;
        
        .section-label {
          display: block;
          padding: 0 1rem;
          margin-bottom: 0.8rem;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
        }
      }
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      padding: 1rem 1.2rem;
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      border-radius: 14px;
      transition: var(--transition);
      margin-bottom: 0.3rem;
      position: relative;
      cursor: pointer;

      i { font-size: 1.2rem; transition: var(--transition); }
      span { font-weight: 600; font-size: 0.95rem; }

      &:hover {
        background: rgba(255,255,255,0.05);
        color: white;
        i { color: var(--secondary); transform: scale(1.1); }
      }

      &.active {
        background: var(--primary);
        color: white;
        box-shadow: 0 10px 20px rgba(0, 85, 164, 0.2);
        i { color: white; }
        
        &::after {
          content: '';
          position: absolute;
          right: 0.5rem;
          width: 5px;
          height: 15px;
          background: var(--secondary);
          border-radius: 10px;
        }
      }

      &.back-home {
        color: var(--secondary);
        margin-top: 1rem;
        &:hover { background: rgba(245, 158, 11, 0.1); }
      }
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      
      .user-quick-profile {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: rgba(255,255,255,0.03);
        padding: 0.8rem;
        border-radius: 16px;
        
        .avatar {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, var(--secondary), #d97706);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: white;
        }
        
        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          .name { font-size: 0.85rem; font-weight: 700; color: white; }
          .role { font-size: 0.7rem; color: rgba(255,255,255,0.4); }
        }
        
        .btn-logout {
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: var(--transition);
          &:hover { color: #ef4444; }
        }
      }
    }

    /* COLLAPSED STATES */
    .student-sidebar.collapsed {
      width: var(--sidebar-collapsed);
      .logo-text, .section-label, span, .user-quick-profile .info { display: none; }
      .sidebar-header { padding: 2rem 1rem; }
      .nav-item { justify-content: center; padding: 1.2rem; }
      .sidebar-footer { padding: 1rem; .user-quick-profile { padding: 0.4rem; justify-content: center; } }
    }

    /* MAIN CONTENT AREA */
    .student-main {
      flex: 1;
      margin-left: var(--sidebar-width);
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      background: #f8fafc;
    }

    .sidebar-hidden .student-main {
      margin-left: var(--sidebar-collapsed);
    }

    .student-content-area {
      padding: 2.5rem;
      flex: 1;
      min-height: 100vh;
    }

    @media (max-width: 1024px) {
      .student-content-area { padding: 1.5rem; }
    }
  `]
})
export class StudentLayoutComponent {
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
