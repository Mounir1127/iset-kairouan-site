import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../services/staff.service';

@Component({
  selector: 'app-staff-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notes-management">
      <!-- HEADER AND SELECTION -->
      <div class="control-header glass-card">
        <div class="header-main">
          <div class="title-wrap">
            <h2>Saisie des Notes</h2>
            <p>Gérez les évaluations et saisissez les notes de vos groupes.</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" (click)="saveAll()" [disabled]="loading || !selectedModule">
              <i class="fas fa-save" *ngIf="!saving"></i>
              <i class="fas fa-spinner fa-spin" *ngIf="saving"></i>
              Enregistrer Tout
            </button>
          </div>
        </div>

        <div class="selection-grid">
          <div class="select-field">
            <label>Matière / Module</label>
            <select class="glass-select" [(ngModel)]="selectedModule" (change)="loadGrades()">
              <option [ngValue]="null" disabled>Sélectionnez un module</option>
              <option *ngFor="let m of modules" [value]="m._id">{{ m.name }}</option>
            </select>
          </div>
          <div class="select-field">
            <label>Groupe / Classe</label>
            <select class="glass-select" [(ngModel)]="selectedGroup" (change)="loadGrades()">
              <option value="all">Tous les groupes</option>
              <option *ngFor="let g of groups" [value]="g._id">{{ g.name }}</option>
            </select>
          </div>
          <div class="select-field">
            <label>Type d'Évaluation</label>
            <select class="glass-select" [(ngModel)]="selectedEvalType" (change)="loadGrades()">
              <option value="DS">Devoir de Contrôle (DS)</option>
              <option value="EX">Examen Final</option>
              <option value="TP">Travaux Pratiques</option>
              <option value="CC">Contrôle Continu</option>
            </select>
          </div>
        </div>
      </div>

      <!-- NOTES INPUT TABLE -->
      <div class="notes-content glass-card">
        <div class="table-actions">
          <span class="count-tag"><i class="fas fa-users"></i> {{ students.length }} étudiants</span>
          <div class="search-mini">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Trouver un étudiant..." [(ngModel)]="searchTerm">
          </div>
        </div>

        <div class="loading-state" *ngIf="loading">
          <i class="fas fa-circle-notch fa-spin"></i>
          <p>Chargement des données...</p>
        </div>

        <div class="table-scroll" *ngIf="!loading">
          <table class="notes-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Étudiant</th>
                <th>Matricule</th>
                <th>Note (/20)</th>
                <th>Remarque</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of filteredStudents(); let i = index">
                <td>{{ i + 1 }}</td>
                <td>
                  <div class="student-info">
                    <span class="name">{{ s.name }}</span>
                  </div>
                </td>
                <td><span class="mat-badge">{{ s.matricule }}</span></td>
                <td>
                  <div class="input-wrap">
                    <input type="number" step="0.25" min="0" max="20" [(ngModel)]="s.tempNote" 
                           class="note-input" [class.low]="s.tempNote !== null && s.tempNote < 10"
                           [class.high]="s.tempNote !== null && s.tempNote >= 15">
                  </div>
                </td>
                <td>
                  <textarea [(ngModel)]="s.tempRemark" class="glass-textarea" placeholder="RAS"></textarea>
                </td>
                <td>
                  <span class="status-tag" [class.validated]="s.tempNote !== null">
                    {{ s.tempNote !== null ? 'Saisie' : 'En attente' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="empty-table" *ngIf="!loading && students.length === 0">
             <i class="fas fa-user-slash"></i>
             <p>Aucun étudiant trouvé pour cette sélection.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notes-management { display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.6s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 24px; padding: 2.2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); }
    .header-main { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; } p { color: #64748b; font-weight: 500; } }
    .btn-primary { background: linear-gradient(135deg, #0055a4, #0077c8); color: white; border: none; padding: 0.9rem 2rem; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; box-shadow: 0 10px 20px rgba(0, 85, 164, 0.15); transition: all 0.3s; &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(0, 85, 164, 0.25); } &:disabled { opacity: 0.6; cursor: not-allowed; } }
    .selection-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; .select-field { label { display: block; font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; } .glass-select { width: 100%; background: #f1f5f9; border: 1px solid transparent; padding: 1rem; border-radius: 16px; font-family: inherit; font-weight: 700; color: #0f172a; cursor: pointer; &:focus { background: white; border-color: #0055a4; outline: none; box-shadow: 0 0 0 4px rgba(0, 85, 164, 0.08); } } } }
    .table-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; .count-tag { background: #eff6ff; color: #0055a4; padding: 0.5rem 1.2rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.6rem; } .search-mini { position: relative; i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; } input { background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.6rem 1rem 0.6rem 2.8rem; border-radius: 12px; font-family: inherit; font-size: 0.9rem; &:focus { outline: none; border-color: #0055a4; background: white; } } } }
    .notes-table { width: 100%; border-collapse: collapse; th { padding: 1.2rem 1.5rem; text-align: left; font-size: 0.8rem; font-weight: 850; color: #94a3b8; border-bottom: 2px solid #f1f5f9; text-transform: uppercase; letter-spacing: 1px; } td { padding: 1.2rem 1.5rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; } .student-info .name { font-weight: 800; color: #0f172a; font-size: 0.95rem; } .mat-badge { font-family: monospace; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.8rem; } .note-input { width: 80px; padding: 0.8rem; border-radius: 12px; border: 2px solid #e2e8f0; background: #f8fafc; font-weight: 900; text-align: center; font-size: 1.1rem; color: #0f172a; transition: all 0.3s; &::-webkit-inner-spin-button { opacity: 1; } &:focus { outline: none; border-color: #0055a4; background: white; } &.low { color: #ef4444; border-color: #fee2e2; } &.high { color: #10b981; border-color: #d1fae5; } } .glass-textarea { width: 100%; min-height: 40px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.6rem; font-family: inherit; resize: none; font-size: 0.85rem; &:focus { outline: none; border-color: #0055a4; } } .status-tag { font-size: 0.75rem; font-weight: 800; padding: 0.4rem 0.8rem; border-radius: 50px; background: #f1f5f9; color: #64748b; &.validated { background: #dcfce7; color: #15803d; } } tr:hover td { background: rgba(0, 85, 164, 0.02); } }
    .loading-state, .empty-table { padding: 4rem; text-align: center; color: #64748b; i { font-size: 2.5rem; margin-bottom: 1rem; color: #cbd5e1; } }
  `]
})
export class StaffNotesComponent implements OnInit {
  modules: any[] = [];
  groups: any[] = [];
  students: any[] = [];

  selectedModule: any = null;
  selectedGroup: string = 'all';
  selectedEvalType: string = 'DS';

  loading = false;
  saving = false;
  searchTerm = '';

  constructor(private staffService: StaffService) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.loading = true;
    this.staffService.getModules().subscribe({
      next: (data) => {
        this.modules = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error modules', err);
        this.loading = false;
      }
    });

    // Load groups (mocked for now as we don't have a direct list of teacher groups)
    this.groups = [
      { _id: 'g1', name: 'DSI 3.1' },
      { _id: 'g2', name: 'DSI 3.2' },
      { _id: 'g3', name: 'RSI 2.1' }
    ];
  }

  loadGrades() {
    if (!this.selectedModule) return;

    this.loading = true;
    this.staffService.getGrades(this.selectedModule, this.selectedGroup !== 'all' ? this.selectedGroup : undefined).subscribe({
      next: (grades) => {
        // Combine with all students of the group to ensure everyone is listed
        this.staffService.getStudents(this.selectedGroup !== 'all' ? this.selectedGroup : undefined).subscribe({
          next: (students) => {
            this.students = students.map(s => {
              const grade = grades.find(g => g.student._id === s._id && g.examType === this.selectedEvalType);
              return {
                ...s,
                tempNote: grade ? grade.value : null,
                tempRemark: grade ? grade.remarks : ''
              };
            });
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error grades', err);
        this.loading = false;
      }
    });
  }

  filteredStudents() {
    const term = this.searchTerm.toLowerCase();
    return this.students.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.matricule.includes(term)
    );
  }

  saveAll() {
    if (!this.selectedModule) return;

    this.saving = true;
    const updates = this.students
      .filter(s => s.tempNote !== null)
      .map(s => ({
        student: s._id,
        module: this.selectedModule,
        value: s.tempNote,
        remarks: s.tempRemark,
        examType: this.selectedEvalType,
        semester: '1', // Hardcoded for now
        academicYear: '2024/2025'
      }));

    this.staffService.updateGradesBulk(updates).subscribe({
      next: () => {
        this.saving = false;
        alert('Notes enregistrées avec succès !');
      },
      error: (err) => {
        this.saving = false;
        console.error('Save error', err);
      }
    });
  }
}
