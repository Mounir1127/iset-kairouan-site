import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StaffService } from '../../../services/staff.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-ultra-pro">
      <!-- WELCOME SECTION -->
      <div class="welcome-banner">
        <div class="banner-content">
          <div class="text-group">
            <h1>Bonjour, {{ currentUser?.name }} ! 👋</h1>
            <p>Prêt pour vos sessions d'aujourd'hui ? Vos étudiants vous attendent.</p>
          </div>
          <div class="quick-status">
            <div class="status-item">
              <span class="value">{{ stats.totalModules }}</span>
              <span class="label">Modules</span>
            </div>
            <div class="v-divider"></div>
            <div class="status-item">
              <span class="value">85%</span>
              <span class="label">Assiduité Moy.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- GRID STATS -->
      <div class="stats-grid">
        <div class="stat-card glass-premium graduate">
          <div class="icon-wrap"><i class="fas fa-user-graduate"></i></div>
          <div class="stat-info">
            <span class="label">Total Étudiants</span>
            <span class="count">{{ stats.totalStudents }}</span>
            <span class="trend up"><i class="fas fa-arrow-up"></i> +5% ce mois</span>
          </div>
        </div>
        <div class="stat-card glass-premium classes">
          <div class="icon-wrap"><i class="fas fa-book-reader"></i></div>
          <div class="stat-info">
            <span class="label">Modules Affectés</span>
            <span class="count">{{ stats.totalModules }}</span>
            <span class="tag">ISET Kairouan</span>
          </div>
        </div>
        <div class="stat-card glass-premium resources">
          <div class="icon-wrap"><i class="fas fa-file-invoice"></i></div>
          <div class="stat-info">
            <span class="label">Supports Partagés</span>
            <span class="count">{{ stats.totalMaterials }}</span>
            <span class="trend up"><i class="fas fa-check-circle"></i> En ligne</span>
          </div>
        </div>
        <div class="stat-card glass-premium messages">
          <div class="icon-wrap"><i class="fas fa-envelope-open-text"></i></div>
          <div class="stat-info">
            <span class="label">Réclamations</span>
            <span class="count">{{ stats.pendingClaims }}</span>
            <span class="trend alert" *ngIf="stats.pendingClaims > 0">Non traitées</span>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT ROW -->
      <div class="content-row">
        <!-- NEXT CLASS CARD -->
        <div class="main-card glass-premium next-class">
          <div class="card-header">
            <h3><i class="fas fa-clock"></i> Prochaine Session</h3>
            <button class="btn-view-all" routerLink="/staff/schedule">Mon Planning <i class="fas fa-chevron-right"></i></button>
          </div>
          <div class="class-info-wrap" *ngIf="nextSession; else noSession">
            <div class="class-time-badge">
              <span class="time">{{ nextSession.startTime }}</span>
              <span class="duration">90 min</span>
            </div>
            <div class="class-details">
              <h4>{{ nextSession.module?.name }}</h4>
              <p><i class="fas fa-users"></i> Groupe {{ nextSession.classGroup?.name }}</p>
              <div class="location-tag"><i class="fas fa-location-dot"></i> {{ nextSession.room }}</div>
            </div>
            <div class="class-actions">
              <button class="btn-start"><i class="fas fa-clipboard-check"></i> Appel</button>
              <button class="btn-docs"><i class="fas fa-file-pdf"></i> Supports</button>
            </div>
          </div>
          <ng-template #noSession>
             <div class="empty-session">
               <i class="fas fa-mug-hot"></i>
               <p>Aucune session prévue prochainement.</p>
             </div>
          </ng-template>
        </div>

        <!-- QUICK ACTIONS GRID -->
        <div class="quick-actions-card glass-premium">
          <h3>Actions Rapides</h3>
          <div class="actions-grid">
            <button class="action-btn" routerLink="/staff/notes">
              <i class="fas fa-pen-nib"></i>
              <span>Saisir Notes</span>
            </button>
            <button class="action-btn" routerLink="/staff/materials">
              <i class="fas fa-upload"></i>
              <span>Déposer TD</span>
            </button>
            <button class="action-btn" routerLink="/staff/announcements">
              <i class="fas fa-bullhorn"></i>
              <span>Avis Urgent</span>
            </button>
            <button class="action-btn" routerLink="/staff/claims">
              <i class="fas fa-user-check"></i>
              <span>Réclamations</span>
            </button>
          </div>
        </div>
      </div>

      <!-- STUDENT ENGAGEMENT CHART (Placeholder) -->
      <div class="chart-section glass-premium">
        <div class="chart-header">
          <div class="titles">
            <h3>Engagement des Étudiants</h3>
            <p>Participation et présence hebdomadaire par groupe</p>
          </div>
          <div class="filters">
            <select class="glass-select">
              <option>Tous les modules</option>
              <option>DSI 3.1</option>
            </select>
          </div>
        </div>
        <div class="chart-placeholder">
          <div class="bar-chart">
            <div class="bar" style="height: 60%" data-label="Lun"></div>
            <div class="bar" style="height: 85%" data-label="Mar"></div>
            <div class="bar" style="height: 45%" data-label="Mer"></div>
            <div class="bar active" style="height: 95%" data-label="Jeu"></div>
            <div class="bar" style="height: 70%" data-label="Ven"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-ultra-pro { display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* WELCOME BANNER */
    .welcome-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      border-radius: 30px; padding: 3rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
      &::after { content: ''; position: absolute; top: -50%; right: -10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%); border-radius: 50%; }
      .banner-content { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem; letter-spacing: -1px; } p { font-size: 1.1rem; color: rgba(255,255,255,0.7); font-weight: 500; } }
      .quick-status { display: flex; gap: 3rem; align-items: center; .v-divider { width: 1px; height: 50px; background: rgba(255,255,255,0.1); } .status-item { display: flex; flex-direction: column; align-items: center; .value { font-size: 2rem; font-weight: 900; color: #f59e0b; } .label { font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; font-weight: 700; } } }
    }

    /* GLASS CARDS */
    .glass-premium { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 24px; padding: 1.8rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); transition: all 0.4s ease; &:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); } }

    /* STATS GRID */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .stat-card {
      display: flex; align-items: center; gap: 1.5rem;
      .icon-wrap { width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
      &.graduate .icon-wrap { background: #eff6ff; color: #0055a4; }
      &.classes .icon-wrap { background: #fffbeb; color: #f59e0b; }
      &.resources .icon-wrap { background: #ecfdf5; color: #10b981; }
      &.messages .icon-wrap { background: #fef2f2; color: #ef4444; }
      .stat-info { display: flex; flex-direction: column; .label { font-size: 0.85rem; color: #64748b; font-weight: 600; } .count { font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 0.1rem 0; } .trend, .tag { font-size: 0.75rem; font-weight: 700; } .trend.up { color: #10b981; } .trend.down { color: #f59e0b; } .trend.alert { color: #ef4444; } .tag { color: #0055a4; } }
    }

    /* CONTENT ROW */
    .content-row { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; h3 { font-size: 1.25rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.8rem; i { color: #0055a4; } } .btn-view-all { background: none; border: none; font-weight: 700; color: #0055a4; cursor: pointer; font-size: 0.9rem; } }

    .next-class {
      .class-info-wrap { background: #f8fafc; border-radius: 20px; padding: 2rem; display: flex; align-items: center; gap: 2.5rem; }
      .empty-session { text-align: center; padding: 2rem; color: #64748b; i { font-size: 3rem; margin-bottom: 1rem; color: #cbd5e1; } }
      .class-time-badge { background: #0055a4; color: white; padding: 1rem 1.5rem; border-radius: 16px; display: flex; flex-direction: column; align-items: center; .time { font-size: 1.6rem; font-weight: 900; } .duration { font-size: 0.75rem; font-weight: 600; opacity: 0.8; } }
      .class-details { flex: 1; h4 { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; } p { color: #64748b; font-weight: 600; margin-bottom: 0.8rem; } .location-tag { font-size: 0.85rem; color: #0055a4; font-weight: 800; display: inline-flex; align-items: center; gap: 0.5rem; background: #eff6ff; padding: 0.4rem 1rem; border-radius: 10px; } }
      .class-actions { display: flex; flex-direction: column; gap: 0.8rem; button { padding: 0.8rem 1.5rem; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 0.6rem; &.btn-start { background: #0055a4; color: white; &:hover { background: #003e7a; transform: scale(1.05); } } &.btn-docs { background: #fef3c7; color: #d97706; &:hover { background: #fde68a; } } } }
    }

    .quick-actions-card {
      h3 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 2rem; }
      .actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .action-btn { background: #f1f5f9; border: none; padding: 1.5rem; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; transition: all 0.3s; i { font-size: 1.5rem; color: #0055a4; } span { font-weight: 700; font-size: 0.85rem; color: #0f172a; } &:hover { background: #0055a4; i, span { color: white; } } }
    }

    .chart-section {
      .chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; h3 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.3rem; } p { color: #64748b; font-size: 0.95rem; font-weight: 500; } .glass-select { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 0.6rem 1.2rem; border-radius: 10px; font-family: inherit; font-weight: 700; cursor: pointer; } }
      .chart-placeholder { height: 250px; display: flex; align-items: flex-end; padding-bottom: 2rem; border-bottom: 2px solid #f1f5f9; .bar-chart { width: 100%; display: flex; justify-content: space-around; align-items: flex-end; gap: 2rem; height: 100%; .bar { width: 40px; background: #cbd5e1; border-radius: 8px 8px 4px 4px; position: relative; transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); &::after { content: attr(data-label); position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.85rem; font-weight: 700; color: #64748b; } &:hover, &.active { background: linear-gradient(to top, #0055a4, #00b4db); box-shadow: 0 10px 20px rgba(0, 85, 164, 0.2); } } } }
    }

    @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .content-row { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } .welcome-banner { padding: 2rem; } .next-class .class-info-wrap { flex-direction: column; text-align: center; } }
  `]
})
export class StaffDashboardComponent implements OnInit {
  currentUser: any;
  stats = {
    totalStudents: 0,
    totalModules: 0,
    totalMaterials: 0,
    pendingClaims: 0
  };
  nextSession: any = null;

  constructor(
    private staffService: StaffService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    if (this.currentUser?.id) {
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    const staffId = this.currentUser.id;
    this.staffService.getStats(staffId).subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error stats', err)
    });

    this.staffService.getSchedule(staffId).subscribe({
      next: (schedule) => {
        if (schedule && schedule.length > 0) {
          this.nextSession = schedule[0];
        }
      },
      error: (err) => console.error('Error schedule', err)
    });
  }
}
