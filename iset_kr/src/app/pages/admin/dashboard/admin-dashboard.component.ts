import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-overview" *ngIf="isBrowser">
      <div class="welcome-banner animate-fade-in">
        <div class="banner-content">
          <div class="banner-badge">SYSTÈME GESTION</div>
          <h1>TABLEAU DE BORD <span class="text-gradient">ULTRA PRO</span></h1>
          <p>Supervision intelligente et contrôle total de l'ISET Kairouan.</p>
        </div>
        <div class="banner-glass-stat shadow-premium">
          <div class="stat-inner">
            <div class="server-status">
              <span class="status-dot pulse"></span>
              <span class="label">SERVEUR ACTIF</span>
            </div>
            <div class="time-display">{{ currentTime | date:'HH:mm' }}</div>
          </div>
        </div>
      </div>

      <div class="stats-grid animate-stagger">
        <div class="stat-card-premium" *ngFor="let stat of stats; let i = index" [style.animation-delay]="i * 0.1 + 's'">
          <div class="card-bg-glow" [style.background]="stat.color"></div>
          <div class="card-content">
            <div class="stat-top">
              <div class="stat-icon-box" [style.background]="stat.color">
                <i class="fas" [class]="stat.icon"></i>
              </div>
              <div class="stat-trend-pro" [class.up]="true">
                <i class="fas fa-chart-line"></i>
                <span>+8%</span>
              </div>
            </div>
            <div class="stat-main">
              <h2 class="stat-value-pro">{{ stat.value }}</h2>
              <span class="stat-label-pro">{{ stat.label }}</span>
            </div>
          </div>
          <div class="card-wave-pattern"></div>
        </div>
      </div>

      <div class="dashboard-matrix">
        <div class="matrix-card section animate-slide-up">
          <div class="section-header">
            <div class="title-group">
              <i class="fas fa-chart-pie header-icon"></i>
              <div class="text">
                <h3>Répartition des Utilisateurs</h3>
                <p>Analyse granulaire de la communauté</p>
              </div>
            </div>
            <div class="total-pill">Total: {{ totalUsers }}</div>
          </div>
          <div class="chart-wrapper-pro">
            <canvas id="userChartFinal" #userChartFinal></canvas>
            <div class="chart-center-info">
              <span class="val">{{ totalUsers }}</span>
              <span class="lbl">Membres</span>
            </div>
          </div>
        </div>

        <div class="matrix-card section quick-actions animate-slide-up" style="animation-delay: 0.2s">
          <div class="section-header">
            <div class="title-group">
              <i class="fas fa-bolt header-icon gold"></i>
              <div class="text">
                <h3>Centre de Contrôle</h3>
                <p>Actions prioritaires & raccourcis</p>
              </div>
            </div>
          </div>
          <div class="actions-matrix">
            <button class="action-tile-pro" routerLink="/admin/news">
              <div class="tile-icon"><i class="fas fa-bullhorn"></i></div>
              <div class="tile-text">
                <strong>Annonces</strong>
                <span>Publier nouveauté</span>
              </div>
            </button>
            <button class="action-tile-pro" routerLink="/admin/users">
              <div class="tile-icon blue"><i class="fas fa-users-cog"></i></div>
              <div class="tile-text">
                <strong>Personnel</strong>
                <span>Gérer le staff</span>
              </div>
            </button>
            <button class="action-tile-pro" routerLink="/admin/structure">
              <div class="tile-icon gold"><i class="fas fa-sitemap"></i></div>
              <div class="tile-text">
                <strong>Structure</strong>
                <span>Dépt & Classes</span>
              </div>
            </button>
            <button class="action-tile-pro" routerLink="/admin/messages">
              <div class="tile-icon purple"><i class="fas fa-comments"></i></div>
              <div class="tile-text">
                <strong>Messagerie</strong>
                <span>Consulter flux</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Redesigned Styles */
    :host {
      --ultra-navy: #0f172a;
      --ultra-blue: #3b82f6;
      --ultra-gold: #f59e0b;
      --ultra-glass: rgba(255, 255, 255, 0.7);
      --font-outfit: 'Outfit', sans-serif;
    }

    .dashboard-overview {
      padding: 1rem;
    }

    .text-gradient {
      background: linear-gradient(135deg, var(--ultra-blue), var(--ultra-gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 950;
    }

    .welcome-banner {
      background: white;
      padding: 3rem;
      border-radius: 32px;
      margin-bottom: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.04);
      border: 1px solid rgba(15, 23, 42, 0.05);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%);
        border-radius: 50%;
      }

      .banner-badge {
        background: #f1f5f9;
        color: #64748b;
        padding: 0.5rem 1.2rem;
        border-radius: 100px;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 2px;
        margin-bottom: 1.5rem;
        display: inline-block;
      }
      h1 { font-family: var(--font-outfit); font-size: 2.4rem; margin-bottom: 0.8rem; letter-spacing: -1px; }
      p { color: #64748b; font-size: 1.1rem; max-width: 500px; }
    }

    .banner-glass-stat {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      padding: 1.5rem 2.5rem;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      
      .server-status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 0.5rem;
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
        .label { font-size: 0.75rem; font-weight: 800; color: #10b981; letter-spacing: 1px; }
      }
      .time-display { font-size: 2rem; font-weight: 900; color: var(--ultra-navy); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stat-card-premium {
      background: white;
      border-radius: 28px;
      padding: 2rem;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(15, 23, 42, 0.05);
      box-shadow: 0 10px 30px rgba(0,0,0,0.02);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: default;

      &:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 25px 60px rgba(0,0,0,0.08);
        .card-bg-glow { opacity: 0.15; transform: scale(1.5); }
      }

      .card-bg-glow {
        position: absolute;
        top: -20px;
        right: -20px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        filter: blur(40px);
        opacity: 0.08;
        transition: all 0.5s ease;
      }

      .stat-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }

      .stat-icon-box {
        width: 52px;
        height: 52px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.4rem;
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }

      .stat-trend-pro {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0.4rem 0.8rem;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 800;
        &.up { background: #ecfdf5; color: #10b981; }
      }

      .stat-main {
        .stat-value-pro { font-size: 2.2rem; font-weight: 900; color: var(--ultra-navy); margin-bottom: 0.2rem; }
        .stat-label-pro { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
      }
    }

    .dashboard-matrix {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2.5rem;
      @media (max-width: 1100px) { grid-template-columns: 1fr; }
    }

    .matrix-card {
      background: white;
      border-radius: 32px;
      padding: 2.5rem;
      border: 1px solid rgba(15, 23, 42, 0.05);
      box-shadow: 0 4px 30px rgba(0,0,0,0.02);

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2.5rem;

        .title-group {
          display: flex;
          gap: 1.2rem;
          .header-icon { font-size: 1.5rem; color: var(--ultra-navy); margin-top: 5px; &.gold { color: var(--ultra-gold); } }
          h3 { font-size: 1.4rem; font-weight: 900; margin-bottom: 0.3rem; }
          p { color: #94a3b8; font-size: 0.9rem; font-weight: 500; }
        }

        .total-pill {
          background: var(--ultra-navy);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
        }
      }
    }

    .chart-wrapper-pro {
      position: relative;
      height: 350px;
      display: flex;
      justify-content: center;
      align-items: center;

      .chart-center-info {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        .val { font-size: 2.5rem; font-weight: 900; color: var(--ultra-navy); line-height: 1; }
        .lbl { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
      }
    }

    .actions-matrix {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .action-tile-pro {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      padding: 2rem 1.5rem;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.2rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      text-align: left;

      .tile-icon {
        width: 48px;
        height: 48px;
        background: white;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        color: var(--ultra-navy);
        box-shadow: 0 4px 15px rgba(0,0,0,0.04);
        &.blue { color: #3b82f6; }
        &.gold { color: #f59e0b; }
        &.purple { color: #8b5cf6; }
      }

      .tile-text {
        strong { display: block; font-size: 1rem; color: var(--ultra-navy); margin-bottom: 2px; }
        span { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }
      }

      &:hover {
        background: white;
        transform: translateY(-8px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        .tile-icon { background: var(--ultra-navy); color: white; transform: rotate(10deg); }
      }
    }

    /* Animations */
    .pulse { animation: pulseAnim 2s infinite; }
    @keyframes pulseAnim { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
    
    .animate-fade-in { animation: fadeIn 1s ease both; }
    .animate-slide-up { animation: slideUp 0.8s ease both; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('userChartFinal') chartCanvas!: ElementRef;
  stats: any[] = [];
  currentUser: any;
  chart: any;
  totalUsers: number = 0;
  isBrowser: boolean;
  currentTime = new Date();

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Chart will be initialized after stats are loaded to ensure data presence
  }

  loadStats() {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = [
          { label: 'Étudiants', value: data.students.toLocaleString(), icon: 'fa-user-graduate', color: '#0055a4' },
          { label: 'Enseignants', value: data.teachers.toLocaleString(), icon: 'fa-chalkboard-teacher', color: '#f59e0b' },
          { label: 'Départements', value: data.departments.toLocaleString(), icon: 'fa-university', color: '#0f172a' },
          { label: 'Modules', value: data.modules.toLocaleString(), icon: 'fa-book', color: '#64748b' }
        ];

        this.totalUsers = Object.values(data.userDistribution).reduce((a: any, b: any) => a + b, 0) as number;
        if (this.isBrowser) {
          setTimeout(() => this.initChart(data.userDistribution), 0);
        }
      },
      error: () => {
        const demoData = { students: 1245, staff: 158, admins: 5, chefs: 6 };
        this.stats = [
          { label: 'Étudiants', value: '1,245', icon: 'fa-user-graduate', color: '#0055a4' },
          { label: 'Enseignants', value: '158', icon: 'fa-chalkboard-teacher', color: '#f59e0b' },
          { label: 'Départements', value: '6', icon: 'fa-university', color: '#0f172a' },
          { label: 'Modules', value: '342', icon: 'fa-book', color: '#64748b' }
        ];
        this.totalUsers = 1414;
        if (this.isBrowser) {
          setTimeout(() => this.initChart(demoData), 0);
        }
      }
    });
  }

  initChart(distribution: any) {
    if (this.chart) this.chart.destroy();

    const ctx = this.chartCanvas?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Étudiants', 'Enseignants', 'Admins', 'Chefs Dept'],
        datasets: [{
          data: [distribution.students, distribution.staff, distribution.admins, distribution.chefs],
          backgroundColor: [
            '#0055a4', // Blue ISET
            '#f59e0b', // Gold ISET
            '#0f172a', // Navy
            '#94a3b8'  // Slate
          ],
          borderWidth: 0,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                family: "'Outfit', sans-serif",
                size: 12,
                weight: 600
              }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            cornerRadius: 10,
            displayColors: false
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: 'easeOutQuart'
        }
      }
    });
  }
}
