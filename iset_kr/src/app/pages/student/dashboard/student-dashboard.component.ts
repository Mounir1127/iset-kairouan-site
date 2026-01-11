import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header animate-fade-in">
        <div class="welcome-text">
          <h1>Bonjour, <span class="highlight">{{ currentUser?.name }}</span> 👋</h1>
          <p class="text-muted">Ravi de vous revoir. Voici un aperçu de votre situation académique.</p>
        </div>
        <div class="date-display">
          <i class="far fa-calendar-alt"></i>
          <span>{{ today | date:'EEEE, d MMMM yyyy' : '' : 'fr' }}</span>
        </div>
      </header>

      <div class="stats-grid animate-fade-up">
        <div class="stat-card">
          <div class="stat-icon bg-primary-light text-primary">
            <i class="fas fa-star"></i>
          </div>
          <div class="stat-info">
            <h3>{{ stats.gradesCount }}</h3>
            <p>Notes publiées</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-success-light text-success">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-info">
            <h3>{{ stats.schedulesCount }}</h3>
            <p>Séances cette semaine</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-warning-light text-warning">
            <i class="fas fa-file-download"></i>
          </div>
          <div class="stat-info">
            <h3>{{ stats.materialsCount }}</h3>
            <p>Nouveaux supports</p>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="grid-left animate-fade-up delay-1">
          <!-- TODAY'S SCHEDULE -->
          <div class="glass-card schedule-today-card">
            <div class="card-header">
              <h2>📅 Séances d'Aujourd'hui</h2>
              <a routerLink="/student/schedule" class="view-all">Voir tout</a>
            </div>
            
            <div class="today-sessions">
              <div *ngIf="todaySessions.length === 0" class="no-sessions">
                <i class="fas fa-mug-hot"></i>
                <p>Pas de séances aujourd'hui. Profitez-en !</p>
              </div>

              <div *ngFor="let session of todaySessions" class="session-item" [class]="session.type.toLowerCase()">
                <div class="time">{{ session.startTime }}</div>
                <div class="details">
                  <span class="subject">{{ session.subject?.name }}</span>
                  <div class="meta">
                    <span><i class="fas fa-map-marker-alt"></i> {{ session.room }}</span>
                    <span><i class="fas fa-user-tie"></i> {{ session.staff?.name }}</span>
                  </div>
                </div>
                <div class="type-badge">{{ session.type }}</div>
              </div>
            </div>
          </div>

          <!-- QUICK LINKS / SHORTCUTS -->
          <div class="glass-card shortcuts-card">
            <div class="card-header">
              <h2>Accès Rapide</h2>
            </div>
            <div class="shortcuts-grid">
              <a routerLink="/student/schedule" class="shortcut-item">
                <div class="icon"><i class="fas fa-clock"></i></div>
                <span>Mon Emploi</span>
              </a>
              <a routerLink="/student/grades" class="shortcut-item">
                <div class="icon"><i class="fas fa-award"></i></div>
                <span>Mes Notes</span>
              </a>
              <a routerLink="/student/materials" class="shortcut-item">
                <div class="icon"><i class="fas fa-book"></i></div>
                <span>Mes Cours</span>
              </a>
              <a href="#" class="shortcut-item">
                <div class="icon"><i class="fas fa-envelope"></i></div>
                <span>Messages</span>
              </a>
            </div>
          </div>
        </div>

        <div class="grid-right animate-fade-up delay-2">
           <!-- RECENT ACTIVITY OR ANNOUNCEMENTS -->
           <div class="glass-card info-card">
              <div class="card-header">
                <h2>Informations Classe</h2>
              </div>
              <div class="info-content">
                <div class="info-item">
                  <span class="label">Département:</span>
                  <span class="value">{{ currentUser?.department?.name || currentUser?.department || 'Non assigné' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Classe:</span>
                  <span class="value">{{ currentUser?.classGroup?.name || currentUser?.classGroup || 'Non assignée' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Niveau:</span>
                  <span class="value">{{ currentUser?.level || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Groupe:</span>
                  <span class="value">Groupe {{ currentUser?.group || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Matricule:</span>
                  <span class="value">{{ currentUser?.matricule }}</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      
      h1 {
        font-size: 2.2rem;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 0.5rem;
        .highlight { color: #0055a4; }
      }
      
      .date-display {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        background: white;
        padding: 0.8rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        font-weight: 600;
        color: #64748b;
        i { color: #f59e0b; }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.8rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease;
      
      &:hover { transform: translateY(-5px); }
      
      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }
      
      .stat-info {
        h3 { font-size: 1.8rem; font-weight: 800; margin: 0; color: #0f172a; }
        p { margin: 0; color: #64748b; font-weight: 500; font-size: 0.9rem; }
      }
    }

    .bg-primary-light { background: rgba(0, 85, 164, 0.1); }
    .bg-success-light { background: rgba(16, 185, 129, 0.1); }
    .bg-warning-light { background: rgba(245, 158, 11, 0.1); }
    .text-primary { color: #0055a4; }
    .text-success { color: #10b981; }
    .text-warning { color: #f59e0b; }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .glass-card {
      background: white;
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(241, 245, 249, 1);
      
      .card-header {
        margin-bottom: 2rem;
        h2 { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0; }
      }
    }

    .shortcuts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1.2rem;
    }

    .shortcut-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 18px;
      text-decoration: none;
      transition: all 0.3s ease;
      border: 1px solid transparent;

      .icon {
        width: 50px;
        height: 50px;
        background: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: #0055a4;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      }
      
      span { font-weight: 600; font-size: 0.9rem; color: #475569; }
      
      &:hover {
        background: white;
        border-color: #0055a4;
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 85, 164, 0.08);
      }
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
      
      .label { color: #64748b; font-weight: 500; font-size: 0.9rem; }
      .value { color: #0f172a; font-weight: 700; font-size: 0.95rem; }
    }

    .animate-fade-in { animation: fadeIn 0.6s ease-out; }
    .animate-fade-up { animation: fadeUp 0.6s ease-out both; }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .schedule-today-card {
      margin-bottom: 2rem;
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .view-all { font-size: 0.85rem; font-weight: 700; color: #0055a4; text-decoration: none; &:hover { text-decoration: underline; } }
      }
    }

    .today-sessions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .session-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.2rem;
      background: #f8fafc;
      border-radius: 16px;
      border-left: 4px solid #0055a4;
      position: relative;
      transition: all 0.3s ease;

      &:hover { transform: translateX(5px); background: white; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

      .time { font-weight: 800; color: #0055a4; min-width: 60px; font-size: 0.95rem; }
      
      .details {
        flex: 1;
        .subject { display: block; font-weight: 700; color: #0f172a; margin-bottom: 0.3rem; }
        .meta { display: flex; gap: 1rem; font-size: 0.75rem; color: #64748b; i { color: #f59e0b; } }
      }

      .type-badge { font-size: 0.65rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; background: #0055a4; color: white; text-transform: uppercase; }

      &.td { border-left-color: #f59e0b; .type-badge { background: #f59e0b; } .time { color: #f59e0b; } }
      &.tp { border-left-color: #10b981; .type-badge { background: #10b981; } .time { color: #10b981; } }
    }

    .no-sessions {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
      i { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
      p { font-weight: 600; font-size: 0.95rem; }
    }

    @media (max-width: 1024px) {
      .content-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  currentUser: any;
  today = new Date();
  stats = {
    gradesCount: 0,
    schedulesCount: 0,
    materialsCount: 0
  };
  todaySessions: any[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadTodaySchedule();
  }

  loadStats(): void {
    if (!this.currentUser?._id) return;

    const params = {
      studentId: this.currentUser.id || this.currentUser._id,
      classGroupId: this.currentUser.classGroup?._id || this.currentUser.classGroup || ''
    };

    this.http.get<any>('/api/student/stats', { params }).subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading dashboard stats', err)
    });
  }

  loadTodaySchedule(): void {
    const classGroupId = this.currentUser?.classGroup?._id || this.currentUser?.classGroup;
    if (!classGroupId) return;

    this.http.get<any[]>('/api/student/schedule', {
      params: { classGroupId }
    }).subscribe({
      next: (data) => {
        const daysFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const currentDayFr = daysFr[this.today.getDay()];
        this.todaySessions = data.filter(s => s.day === currentDayFr);
      },
      error: (err) => console.error('Error loading today schedule', err)
    });
  }
}
