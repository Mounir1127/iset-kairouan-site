import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-student-grades',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="grades-container">
      <header class="page-header animate-fade-in">
        <div class="title-area">
          <h1>Mes <span class="highlight">Notes</span> & Évaluations</h1>
          <p class="text-muted">Suivez vos performances académiques semestre par semestre.</p>
        </div>
      </header>

      <div class="grades-table-card glass-card animate-fade-up">
        <div class="table-responsive">
          <table class="grades-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Type d'Examen</th>
                <th>Semestre</th>
                <th>Note</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let grade of grades" class="grade-row">
                <td class="module-cell">
                  <div class="module-info">
                    <span class="module-name">{{ grade.module?.name }}</span>
                    <span class="module-id">{{ grade.module?.code }}</span>
                  </div>
                </td>
                <td><span class="exam-type">{{ grade.examType }}</span></td>
                <td>S{{ grade.semester }}</td>
                <td class="value-cell">
                  <span class="note-badge" [class.excellent]="grade.value >= 15" [class.good]="grade.value >= 10 && grade.value < 15" [class.fail]="grade.value < 10">
                    {{ grade.value | number:'1.2-2' }}
                  </span>
                </td>
                <td>
                  <span class="status-pill published">
                    <i class="fas fa-check-circle me-1"></i> Publié
                  </span>
                </td>
              </tr>
              <tr *ngIf="grades.length === 0">
                <td colspan="5" class="empty-state">
                  <i class="fas fa-info-circle mb-3"></i>
                  <p>Aucune note n'a encore été publiée pour votre compte.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .grades-container { display: flex; flex-direction: column; gap: 2rem; }
    
    .page-header {
      h1 { font-size: 2rem; font-weight: 800; color: #0f172a; .highlight { color: #0055a4; } }
    }

    .glass-card {
      background: white; border-radius: 24px; padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;
    }

    .grades-table {
      width: 100%; border-collapse: collapse;
      
      th {
        text-align: left; padding: 1.5rem 1rem; border-bottom: 2px solid #f8fafc;
        color: #64748b; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;
      }

      .grade-row {
        transition: background 0.2s ease;
        &:hover { background: #f8fafc; }
        td { padding: 1.5rem 1rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
      }
    }

    .module-info {
      display: flex; flex-direction: column; gap: 0.2rem;
      .module-name { font-weight: 700; color: #0f172a; }
      .module-id { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
    }

    .exam-type {
      background: #f1f5f9; padding: 0.4rem 0.8rem; border-radius: 8px;
      font-size: 0.85rem; font-weight: 600; color: #475569;
    }

    .note-badge {
      display: inline-block; width: 60px; height: 35px; line-height: 35px;
      text-align: center; border-radius: 10px; font-weight: 800; font-size: 1rem;
      
      &.excellent { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      &.good { background: rgba(0, 85, 164, 0.1); color: #0055a4; }
      &.fail { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    }

    .status-pill {
      display: inline-flex; align-items: center; padding: 0.4rem 1rem; border-radius: 20px;
      font-size: 0.8rem; font-weight: 700;
      &.published { background: #ecfdf5; color: #059669; }
    }

    .empty-state {
      text-align: center; padding: 5rem 0; color: #94a3b8;
      i { font-size: 3rem; opacity: 0.2; }
      p { font-weight: 600; margin: 0; }
    }

    .animate-fade-in { animation: fadeIn 0.6s ease-out; }
    .animate-fade-up { animation: fadeUp 0.6s ease-out both; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class StudentGradesComponent implements OnInit {
    grades: any[] = [];
    currentUser: any;

    constructor(private http: HttpClient, private authService: AuthService) {
        this.authService.currentUser.subscribe(user => this.currentUser = user);
    }

    ngOnInit(): void {
        this.loadGrades();
    }

    loadGrades(): void {
        if (!this.currentUser?._id) return;
        this.http.get<any[]>('/api/student/grades', {
            params: { studentId: this.currentUser._id }
        }).subscribe({
            next: (data) => this.grades = data,
            error: (err) => console.error('Error loading grades', err)
        });
    }
}
