import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-staff-announcements',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="announcements-page">
      <!-- HEADER -->
      <div class="header-wrap glass-card">
        <div class="header-main">
          <div class="title-wrap">
            <h2>Annonces Pédagogiques</h2>
            <p>Communiquez des informations importantes à vos étudiants.</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" (click)="openCreateModal()">
              <i class="fas fa-plus"></i> Nouvelle Annonce
            </button>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="announcements-list">
        <div *ngFor="let ann of announcements" class="ann-card glass-card" [class.urgent]="ann.priority === 'high'">
          <div class="ann-header">
            <div class="ann-meta">
              <span class="category-tag">{{ ann.category }}</span>
              <span class="date-tag"><i class="far fa-calendar"></i> {{ ann.date | date:'mediumDate' }}</span>
              <span class="target-tag"><i class="fas fa-users"></i> {{ ann.target }}</span>
            </div>
            <div class="ann-options">
              <button class="icon-btn"><i class="fas fa-edit"></i></button>
              <button class="icon-btn delete"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          
          <div class="ann-body">
            <h3>{{ ann.title }}</h3>
            <p>{{ ann.content }}</p>
          </div>
          
          <div class="ann-footer">
            <div class="priority-indicator" [class.high]="ann.priority === 'high'">
              <i class="fas fa-circle"></i> Priorité {{ ann.priority === 'high' ? 'Haute' : 'Normale' }}
            </div>
            <div class="stats-mini">
              <span><i class="far fa-eye"></i> 42 vues</span>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state glass-card" *ngIf="announcements.length === 0">
          <i class="fas fa-bullhorn"></i>
          <h3>Aucune annonce publiée</h3>
          <p>Commencez à informer vos étudiants dès maintenant.</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .announcements-page { display: flex; flex-direction: column; gap: 2rem; animation: slideIn 0.6s ease; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 24px;
      padding: 2.2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    }

    .header-main {
      display: flex; justify-content: space-between; align-items: center;
      h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; }
      p { color: #64748b; font-weight: 500; }
      .btn-primary {
        background: #0055a4; color: white; border: none; padding: 0.9rem 1.8rem;
        border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.8rem;
        transition: all 0.3s; &:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0, 85, 164, 0.2); }
      }
    }

    .announcements-list { display: flex; flex-direction: column; gap: 1.5rem; }

    .ann-card {
      transition: all 0.3s;
      &:hover { transform: scale(1.01); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
      &.urgent { border-left: 6px solid #ef4444; }

      .ann-header {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
        .ann-meta {
          display: flex; gap: 1.2rem; align-items: center;
          .category-tag { background: #eff6ff; color: #0055a4; padding: 0.3rem 0.8rem; border-radius: 8px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; }
          .date-tag, .target-tag { font-size: 0.8rem; font-weight: 600; color: #94a3b8; display: flex; align-items: center; gap: 0.4rem; i { color: #cbd5e1; } }
        }
        .icon-btn {
          background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem; margin-left: 0.8rem;
          &:hover { color: #0055a4; }
          &.delete:hover { color: #ef4444; }
        }
      }

      .ann-body {
        h3 { font-size: 1.4rem; font-weight: 900; color: #0f172a; margin-bottom: 0.8rem; }
        p { color: #475569; line-height: 1.6; font-weight: 500; font-size: 1.05rem; }
      }

      .ann-footer {
        margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9;
        display: flex; justify-content: space-between; align-items: center;
        
        .priority-indicator {
          font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 0.6rem; color: #10b981;
          i { font-size: 0.6rem; }
          &.high { color: #ef4444; }
        }
        .stats-mini { color: #94a3b8; font-size: 0.85rem; font-weight: 600; }
      }
    }

    .empty-state { text-align: center; padding: 5rem; i { font-size: 4rem; color: #f1f5f9; margin-bottom: 2rem; display: block; } }
  `]
})
export class StaffAnnouncementsComponent implements OnInit {
    announcements = [
        { title: 'Date limite du rapport TP1', content: 'Le dépôt final du rapport de TP1 sur "Les architectures MVC" est fixé pour le vendredi 20 janvier à minuit.', category: 'Évaluation', target: 'DSI 3.1 & 3.2', priority: 'high', date: new Date() },
        { title: 'Rattrapage Cours Dev Web', content: 'Une séance de rattrapage est prévue pour mercredi prochain à 14h00 en salle 108.', category: 'Planning', target: 'RSI 2.1', priority: 'normal', date: new Date() }
    ];

    ngOnInit(): void { }

    openCreateModal() { alert('Nouvelle annonce...'); }
}
