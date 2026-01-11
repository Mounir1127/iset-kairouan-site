import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../../services/staff.service';

@Component({
  selector: 'app-staff-claims',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="claims-page">
      <!-- HEADER -->
      <div class="header-wrap glass-card">
        <div class="header-main">
          <div class="title-wrap">
            <h2>Gérer les Réclamations</h2>
            <p>Traitez les requêtes des étudiants concernant les notes ou les absences.</p>
          </div>
          <div class="header-stats">
            <div class="stat-bubble">
              <span class="val">{{ pendingCount }}</span>
              <span class="lab">En attente</span>
            </div>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="loading">
          <i class="fas fa-circle-notch fa-spin"></i>
          <p>Chargement des réclamations...</p>
      </div>

      <!-- CLAIMS LIST -->
      <div class="claims-list" *ngIf="!loading">
        <div *ngFor="let claim of claims" class="claim-card glass-card" [class.pending]="claim.status === 'pending'">
          <div class="claim-header">
            <div class="student-info">
              <div class="avatar">{{ claim.student?.name?.charAt(0) || '?' }}</div>
              <div class="det">
                <h4>{{ claim.student?.name || 'Étudiant Inconnu' }}</h4>
                <span>{{ claim.student?.classGroup?.name || 'N/A' }} • {{ claim.createdAt | date:'shortDate' }}</span>
              </div>
            </div>
            <div class="status-badge" [class]="claim.status">
              {{ claim.status === 'pending' ? 'À traiter' : (claim.status === 'resolved' ? 'Traité' : 'Rejeté') }}
            </div>
          </div>

          <div class="claim-body">
            <div class="subject">
              <span class="label">Sujet:</span>
              <span class="val">{{ claim.subject }}</span>
            </div>
            <p class="content">" {{ claim.description }} "</p>
          </div>

          <div class="claim-footer">
            <div class="attached-info">
              <i class="fas fa-link"></i> Module : <span>{{ claim.module?.name || 'N/A' }}</span>
            </div>
            <div class="actions" *ngIf="claim.status === 'pending'">
              <button class="btn-secondary" (click)="updateStatus(claim._id, 'rejected')" [disabled]="processingId === claim._id">Rejeter</button>
              <button class="btn-primary" (click)="updateStatus(claim._id, 'resolved')" [disabled]="processingId === claim._id">
                <i class="fas fa-check" *ngIf="processingId !== claim._id"></i>
                <i class="fas fa-spinner fa-spin" *ngIf="processingId === claim._id"></i>
                Valider & Fermer
              </button>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state glass-card" *ngIf="claims.length === 0">
          <i class="fas fa-check-circle"></i>
          <h3>Aucune réclamation</h3>
          <p>Toutes les requêtes ont été traitées. Bon travail!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .claims-page { display: flex; flex-direction: column; gap: 2rem; animation: slideUp 0.6s ease; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 24px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); }
    .header-main { display: flex; justify-content: space-between; align-items: center; h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; } p { color: #64748b; font-weight: 500; } .stat-bubble { background: #fef2f2; color: #ef4444; padding: 0.8rem 1.5rem; border-radius: 16px; display: flex; flex-direction: column; align-items: center; .val { font-size: 1.5rem; font-weight: 900; } .lab { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; } } }
    .claims-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap: 1.5rem; }
    .claim-card { display: flex; flex-direction: column; gap: 1.5rem; transition: all 0.3s; &:hover { transform: translateY(-5px); border-color: #0055a4; box-shadow: 0 15px 35px rgba(0,0,0,0.08); } &.pending { border-left: 6px solid #f59e0b; } .claim-header { display: flex; justify-content: space-between; align-items: flex-start; .student-info { display: flex; gap: 1rem; .avatar { width: 40px; height: 40px; border-radius: 10px; background: #f1f5f9; color: #0055a4; display: flex; align-items: center; justify-content: center; font-weight: 800; } .det { h4 { font-weight: 800; color: #0f172a; margin: 0; } span { font-size: 0.75rem; color: #94a3b8; font-weight: 600; } } } .status-badge { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; padding: 0.3rem 0.8rem; border-radius: 6px; &.pending { background: #fffbeb; color: #d97706; } &.resolved { background: #ecfdf5; color: #10b981; } &.rejected { background: #fee2e2; color: #ef4444; } } } .claim-body { .subject { margin-bottom: 0.8rem; .label { font-weight: 800; color: #94a3b8; font-size: 0.8rem; margin-right: 0.5rem; } .val { font-weight: 800; color: #0f172a; } } .content { font-size: 0.95rem; color: #475569; font-style: italic; line-height: 1.5; font-weight: 500; } } .claim-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; .attached-info { font-size: 0.85rem; font-weight: 700; color: #64748b; span { color: #0055a4; font-weight: 900; } i { color: #cbd5e1; margin-right: 0.5rem; } } .actions { display: flex; gap: 0.8rem; button { padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 0.5rem; &:disabled { opacity: 0.6; cursor: not-allowed; } } .btn-primary { background: #0055a4; color: white; border: none; &:hover:not(:disabled) { background: #003e7a; } } .btn-secondary { background: #f1f5f9; color: #64748b; border: none; &:hover:not(:disabled) { background: #fee2e2; color: #ef4444; } } } } }
    .loading-state, .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem; i { font-size: 3rem; margin-bottom: 1.5rem; color: #cbd5e1; } } .empty-state i { color: #10b981; }
    @media (max-width: 640px) { .claims-list { grid-template-columns: 1fr; } .claim-footer { flex-direction: column; gap: 1rem; align-items: stretch; } }
  `]
})
export class StaffClaimsComponent implements OnInit {
  claims: any[] = [];
  loading = false;
  pendingCount = 0;
  processingId: string | null = null;

  constructor(private staffService: StaffService) { }

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims() {
    this.loading = true;
    this.staffService.getClaims().subscribe({
      next: (data) => {
        this.claims = data;
        this.pendingCount = this.claims.filter(c => c.status === 'pending').length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading claims', err);
        this.loading = false;
      }
    });
  }

  updateStatus(id: string, status: string) {
    this.processingId = id;
    this.staffService.updateClaim(id, { status }).subscribe({
      next: () => {
        const claim = this.claims.find(c => c._id === id);
        if (claim) claim.status = status;
        this.pendingCount = this.claims.filter(c => c.status === 'pending').length;
        this.processingId = null;
      },
      error: (err) => {
        console.error('Error updating claim', err);
        this.processingId = null;
        alert('Erreur lors de la mise à jour du statut.');
      }
    });
  }
}
