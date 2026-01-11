import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-academic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="academic-management">
      <div class="welcome-header">
        <div class="header-text">
          <h3>Services Académiques</h3>
          <p>Gestion centrale des notes, examens et emplois du temps.</p>
        </div>
      </div>

      <div class="tabs-container shadow-pro">
        <div class="tabs">
          <button class="tab" [class.active]="activeSection === 'grades'" (click)="activeSection = 'grades'">
            <i class="fas fa-marker"></i> Gestion des Notes
          </button>
          <button class="tab" [class.active]="activeSection === 'exams'" (click)="activeSection = 'exams'">
            <i class="fas fa-file-signature"></i> Examens & DS
          </button>
          <button class="tab" [class.active]="activeSection === 'schedule'" (click)="activeSection = 'schedule'">
            <i class="fas fa-calendar-week"></i> Emploi du temps
          </button>
        </div>

        <div class="tab-content custom-scrollbar">
          <div *ngIf="activeSection === 'grades'">
            <div class="section-header">
              <div class="info-block">
                <h4>Validation des Résultats</h4>
                <p>Nouveaux modules en attente de validation finale.</p>
              </div>
              <button class="btn-primary-gradient"><i class="fas fa-check-double"></i> Tout Valider</button>
            </div>

            <div class="validation-grid">
               <div class="validation-card" *ngFor="let item of modulesToValidate">
                  <div class="card-left">
                     <div class="module-icon"><i class="fas fa-book-open"></i></div>
                     <div class="module-info">
                        <strong>{{ item.module }}</strong>
                        <span>Responsable: {{ item.chef }}</span>
                     </div>
                  </div>
                  <div class="card-actions">
                     <button class="btn-action view"><i class="fas fa-eye"></i> Inspecter</button>
                     <button class="btn-action publish"><i class="fas fa-bullhorn"></i> Publier</button>
                  </div>
               </div>
            </div>
          </div>

          <div *ngIf="activeSection === 'exams'" class="empty-state">
            <div class="icon-wrap"><i class="fas fa-clock"></i></div>
            <h4>Calendrier en cours de préparation</h4>
            <p>La planification pour la prochaine session démarrera sous peu.</p>
          </div>

          <div *ngIf="activeSection === 'schedule'">
            <div class="schedule-editor">
                 <div class="filter-bar glass-card">
                    <label><i class="fas fa-filter"></i> Filtrer par classe :</label>
                    <select [(ngModel)]="selectedClassFilter" (change)="onClassFilterChange()">
                        <option value="">Toutes les classes</option>
                        <option *ngFor="let c of classes" [value]="c._id">{{ c.name }}</option>
                    </select>
                 </div>

                 <!-- Modal for Adding Schedule -->
                 <div class="modal-overlay" *ngIf="displayModal" (click)="closeModal()">
                    <div class="modal-card" (click)="$event.stopPropagation()">
                       <div class="modal-header">
                          <h3><i class="fas fa-calendar-plus"></i> Ajouter une séance</h3>
                          <button class="btn-close" (click)="closeModal()">
                             <i class="fas fa-times"></i>
                          </button>
                       </div>
                       
                       <div class="modal-body">
                          <div class="info-banner" *ngIf="selectedClassFilter">
                             <i class="fas fa-info-circle"></i>
                             <span>{{ getClassName(selectedClassFilter) }} - {{ modalData.day }} {{ modalData.startTime }}-{{ modalData.endTime }}</span>
                          </div>

                          <div *ngIf="validationError" class="error-banner">
                             <i class="fas fa-exclamation-triangle"></i>
                             <span>{{ validationError }}</span>
                          </div>

                          <div class="form-fields">
                             <div class="field-group">
                                <label><i class="fas fa-chalkboard-teacher"></i> Enseignant</label>
                                <select [(ngModel)]="newSchedule.staff">
                                   <option value="" disabled>Sélectionnez un enseignant</option>
                                   <option *ngFor="let s of staffMembers" [value]="s._id">{{ s.name }}</option>
                                </select>
                             </div>

                             <div class="field-group">
                                <label><i class="fas fa-book"></i> Matière</label>
                                <select [(ngModel)]="newSchedule.subject">
                                   <option value="" disabled>Sélectionnez une matière</option>
                                   <option *ngFor="let sub of subjects" [value]="sub._id">{{ sub.name }}</option>
                                </select>
                             </div>

                             <div class="field-group">
                                <label><i class="fas fa-door-open"></i> Salle</label>
                                <input type="text" placeholder="Ex: A102, B205..." [(ngModel)]="newSchedule.room">
                             </div>

                             <div class="field-group">
                                <label><i class="fas fa-tag"></i> Type de séance</label>
                                <div class="type-selector">
                                   <button 
                                      *ngFor="let t of types" 
                                      class="type-btn" 
                                      [class.active]="newSchedule.type === t"
                                      [class.cours]="t === 'Cours'"
                                      [class.td]="t === 'TD'"
                                      [class.tp]="t === 'TP'"
                                      (click)="newSchedule.type = t">
                                      {{ t }}
                                   </button>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div class="modal-footer">
                          <button class="btn-cancel" (click)="closeModal()">
                             <i class="fas fa-times"></i> Annuler
                          </button>
                          <button class="btn-save" (click)="addSchedule()" [disabled]="!newSchedule.staff || !newSchedule.room || !newSchedule.subject">
                             <i class="fas fa-check"></i> Enregistrer
                          </button>
                       </div>
                    </div>
                 </div>

                 <!-- Grid View (Only when class is selected) -->
                 <div class="schedule-grid-container custom-scrollbar" *ngIf="selectedClassFilter">
                    <table class="schedule-table">
                        <thead>
                            <tr>
                                <th class="time-col">Heure</th>
                                <th *ngFor="let day of days">{{ day | uppercase }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let slot of timeSlots">
                                <td class="time-cell">
                                    <span class="start">{{ slot.start }}</span>
                                    <span class="end">{{ slot.end }}</span>
                                </td>
                                <td *ngFor="let day of days" class="session-cell" 
                                    [class.empty]="!getSession(day, slot.start)"
                                    (click)="!getSession(day, slot.start) ? openAddModal(day, slot.start, slot.end) : null">
                                    
                                    <div *ngIf="getSession(day, slot.start) as session" class="session-block" [ngClass]="session.type.toLowerCase()">
                                        <div class="session-main">
                                            <span class="module-name">{{ session.subject?.name || 'Matière' }}</span>
                                            <div class="session-info">
                                                <span class="info-item"><i class="fas fa-chalkboard-teacher"></i> {{ session.staff?.name }}</span>
                                                <span class="info-item"><i class="fas fa-door-open"></i> {{ session.room }}</span>
                                            </div>
                                        </div>
                                        <button class="btn-delete-mini" (click)="$event.stopPropagation(); deleteSchedule(session._id)">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    
                                    <div *ngIf="!getSession(day, slot.start)" class="add-placeholder">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                 </div>

                 <!-- List View (Fallback or Summary) -->
                 <div class="schedule-list" *ngIf="!selectedClassFilter">
                     <div class="info-message">
                        <i class="fas fa-info-circle"></i>
                        <p>Sélectionnez une classe ci-dessus pour voir la grille hebdomadaire interactive.</p>
                     </div>
                     <div class="day-group" *ngFor="let day of days">
                        <h5 *ngIf="getSchedulesForDay(day).length > 0">{{ day }}</h5>
                        <div class="session-card" *ngFor="let s of getSchedulesForDay(day)">
                            <div class="time">{{ s.startTime }} - {{ s.endTime }}</div>
                            <div class="details">
                                <div class="main-info">
                                    <strong>{{ s.subject?.name || 'Matière' }}</strong>
                                    <span class="type-badge" [ngClass]="s.type.toLowerCase()">{{ s.type }}</span>
                                </div>
                                <div class="sub-info">
                                    <span><i class="fas fa-users"></i> {{ s.classGroup?.name }}</span>
                                    <span><i class="fas fa-chalkboard-teacher"></i> {{ s.staff?.name }}</span>
                                    <span><i class="fas fa-map-marker-alt"></i> {{ s.room }}</span>
                                </div>
                            </div>
                            <button class="btn-delete" (click)="deleteSchedule(s._id)"><i class="fas fa-trash"></i></button>
                        </div>
                     </div>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --admin-navy: #0f172a;
      --admin-gold: #f59e0b;
      --admin-blue: #0055a4;
    }

    .academic-management {
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .welcome-header {
      margin-bottom: 2.5rem;
      h3 { font-size: 1.8rem; font-weight: 900; color: var(--admin-navy); margin: 0; }
      p { color: #64748b; font-size: 1rem; margin: 0.5rem 0 0; }
    }

    .tabs-container {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #f1f5f9;
      box-shadow: 0 10px 40px rgba(0,0,0,0.02);
    }

    .tabs { 
      display: flex; 
      background: #fcfdfe;
      border-bottom: 1px solid #f1f5f9;
      padding: 0 2rem;
    }

    .tab {
      padding: 1.5rem 2.5rem;
      border: none;
      background: none;
      font-weight: 800;
      font-size: 0.9rem;
      cursor: pointer;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      position: relative;
      transition: all 0.3s;

      i { font-size: 1.1rem; }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: var(--admin-blue);
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:hover { color: var(--admin-navy); }

      &.active {
        color: var(--admin-blue);
        &::after { width: 100%; }
        i { color: var(--admin-gold); }
      }
    }

    .tab-content { padding: 3rem; min-height: 400px; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;

      h4 { font-size: 1.4rem; font-weight: 900; color: var(--admin-navy); margin: 0; }
      p { color: #64748b; margin-top: 0.4rem; font-weight: 600; }
    }

    .validation-grid {
      display: grid;
      gap: 1.2rem;
    }

    .validation-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-radius: 18px;
      border: 1px solid #f1f5f9;
      transition: all 0.3s;

      &:hover { background: white; border-color: var(--admin-gold); transform: scale(1.01); box-shadow: 0 10px 20px rgba(0,0,0,0.03); }

      .card-left { display: flex; align-items: center; gap: 1.5rem; }

      .module-icon {
        width: 45px;
        height: 45px;
        background: white;
        color: var(--admin-blue);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        box-shadow: 0 4px 10px rgba(0,0,0,0.03);
      }

      .module-info {
        strong { display: block; font-size: 1.1rem; color: var(--admin-navy); margin-bottom: 0.1rem; }
        span { font-size: 0.85rem; color: #64748b; font-weight: 600; }
      }

      .card-actions { display: flex; gap: 0.8rem; }
    }

    .btn-action {
      padding: 0.7rem 1.2rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transition: all 0.2s;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;

      &:hover { border-color: var(--admin-blue); color: var(--admin-blue); background: #f0f7ff; }
      &.publish:hover { border-color: #10b981; color: #10b981; background: #ecfdf5; }
    }

    .btn-primary-gradient {
      background: linear-gradient(135deg, var(--admin-blue) 0%, #004488 100%);
      color: white;
      border: none;
      padding: 0.9rem 1.8rem;
      border-radius: 12px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 8px 15px rgba(0, 85, 164, 0.2);
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-card {
      background: white;
      border-radius: 20px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #f8fafc, #fff);

      h3 {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--admin-navy);
        display: flex;
        align-items: center;
        gap: 0.75rem;

        i { color: var(--admin-blue); }
      }

      .btn-close {
        background: #f1f5f9;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        transition: all 0.2s;

        &:hover {
          background: #fee2e2;
          color: #dc2626;
          transform: rotate(90deg);
        }
      }
    }

    .modal-body {
      padding: 2rem;
    }

    .info-banner {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #1e40af;
      font-weight: 600;

      i { font-size: 1.2rem; }
    }

    .error-banner {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 1px solid #fecaca;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #dc2626;
      font-weight: 600;
      animation: shake 0.4s ease-in-out;

      i { font-size: 1.2rem; }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .field-group {
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        color: var(--admin-navy);
        margin-bottom: 0.75rem;
        font-size: 0.95rem;

        i { color: var(--admin-blue); width: 16px; }
      }

      select, input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 0.95rem;
        font-weight: 500;
        color: #334155;
        transition: all 0.2s;

        &:focus {
          outline: none;
          border-color: var(--admin-blue);
          box-shadow: 0 0 0 4px rgba(0, 85, 164, 0.1);
        }
      }
    }

    .type-selector {
      display: flex;
      gap: 0.75rem;
    }

    .type-btn {
      flex: 1;
      padding: 0.875rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      color: #64748b;

      &:hover {
        border-color: #cbd5e1;
        transform: translateY(-2px);
      }

      &.active {
        color: white;
        border-color: transparent;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

        &.cours { background: linear-gradient(135deg, var(--admin-blue), #003366); }
        &.td { background: linear-gradient(135deg, #10b981, #059669); }
        &.tp { background: linear-gradient(135deg, #f59e0b, #d97706); }
      }
    }

    .modal-footer {
      display: flex;
      gap: 1rem;
      padding: 1.5rem 2rem;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
    }

    .btn-cancel, .btn-save {
      flex: 1;
      padding: 0.875rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: white;
      border: 2px solid #e2e8f0;
      color: #64748b;

      &:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
      }
    }

    .btn-save {
      background: linear-gradient(135deg, var(--admin-blue), #003366);
      border: none;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 85, 164, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 85, 164, 0.3);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      .icon-wrap { font-size: 4rem; color: #f1f5f9; margin-bottom: 2rem; }
      h4 { font-size: 1.4rem; font-weight: 900; color: #94a3b8; }
      p { color: #cbd5e1; font-weight: 600; }
    }

    .schedule-editor { display: flex; flex-direction: column; gap: 2rem; }
    .filter-bar { 
      display: flex; 
      align-items: center; 
      gap: 1rem; 
      padding: 1rem 1.5rem; 
      background: #fff; 
      border-radius: 12px; 
      border: 1px solid #e2e8f0; 
      
      label { 
        font-weight: 700; 
        color: $admin-navy; 
        
        i { 
          color: $admin-blue; 
          margin-right: 0.5rem; 
        } 
      } 
      
      select { 
        padding: 0.5rem; 
        border-radius: 8px; 
        border: 1px solid #cbd5e1; 
        font-weight: 600; 
        color: #334155; 
      } 
    }
    .schedule-form { padding: 1.5rem; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; }
    .schedule-form h4 { margin: 0 0 1rem 0; color: $admin-navy; font-size: 1.1rem; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; align-items: center; }
    .form-grid select, .form-grid input { padding: 0.6rem; border-radius: 8px; border: 1px solid #cbd5e1; width: 100%; }
    .time-inputs { display: flex; align-items: center; gap: 0.5rem; }
    .btn-add { background: $admin-blue; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 700; cursor: pointer; white-space: nowrap; &:hover { background: $admin-navy; } }
    
    .schedule-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .day-group h5 { font-size: 1.2rem; color: $admin-blue; margin: 0 0 1rem 0; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 0.3rem; }
    
    /* Modern Grid Styles */
    .schedule-grid-container { 
        overflow-x: auto; 
        padding-bottom: 1rem; 
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        border: 1px solid #f1f5f9;
        margin-top: 1.5rem;
    }
    
    .schedule-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 900px; }
    
    .schedule-table th { 
        padding: 1.2rem; 
        text-align: center; 
        font-weight: 800; 
        color: #0f172a; 
        border-bottom: 1px solid #e2e8f0; 
        background: #f8fafc; 
        position: sticky;
        top: 0;
        z-index: 10;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
    }
    
    .schedule-table td { 
        border-bottom: 1px solid #f1f5f9; 
        border-right: 1px solid #f1f5f9;
        vertical-align: top; 
        height: 140px; 
        transition: all 0.2s; 
        position: relative;
    }

    .schedule-table tr:last-child td { border-bottom: none; }
    .schedule-table tr td:last-child { border-right: none; }
    
    .time-cell { 
        width: 100px; 
        text-align: center; 
        background: #fff; 
        font-weight: 700; 
        color: #64748b; 
        padding: 1rem; 
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        gap: 0.5rem; 
        border-right: 2px solid #e2e8f0 !important;
        font-family: 'Space Mono', monospace;
        font-size: 0.85rem;
    }
    
    .session-cell { padding: 0.5rem; }
    .session-cell.empty { 
        background: #fff;
        &:hover { 
            background: #f8fafc; 
            cursor: pointer; 
            .add-placeholder { opacity: 1; transform: scale(1); } 
        } 
    }
    
    .add-placeholder { 
        opacity: 0; 
        position: absolute; 
        top: 0; left: 0; 
        width: 100%; height: 100%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: $admin-blue; 
        font-size: 1.5rem; 
        background: rgba(0, 85, 164, 0.05);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        transform: scale(0.9);
        pointer-events: none; 
    }
    
    .session-block { 
        height: calc(100% - 1rem); 
        border-radius: 12px; 
        padding: 0.8rem; 
        color: white; 
        box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
        display: flex; 
        flex-direction: column; 
        justify-content: center;
        gap: 0.4rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid rgba(255,255,255,0.15);
        cursor: pointer;
        position: relative;
        overflow: hidden;

        &:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 5;
        }
        
        &.cours { 
            background: #0055a4; 
            border-left: 5px solid #f59e0b; 
        } 
        &.td { 
            background: #475569; 
            border-left: 5px solid #94a3b8; 
        } 
        &.tp { 
            background: #10b981; 
            border-left: 5px solid #f59e0b; 
        } 
    }
    
    .session-main { 
        display: flex; 
        flex-direction: column; 
        gap: 0.3rem;
    }
    
    .module-name { 
        font-weight: 900; 
        font-size: 0.85rem; 
        line-height: 1.2;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .btn-delete-mini { 
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(0,0,0,0.2); 
        border: none; 
        color: white; 
        width: 22px; 
        height: 22px; 
        border-radius: 6px; 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 0.7rem; 
        transition: all 0.2s;
        opacity: 0;
        
        &:hover { 
            background: #ef4444; 
            opacity: 1;
        } 
    }

    .session-block:hover .btn-delete-mini { opacity: 0.8; }
    
    .session-info { 
        display: flex; 
        flex-direction: column; 
        gap: 0.2rem; 
    }
    
    .info-item { 
        display: flex; 
        align-items: center; 
        gap: 0.5rem; 
        font-size: 0.75rem;
        font-weight: 700; 
        color: rgba(255,255,255,0.9);
        
        i { width: 14px; text-align: center; opacity: 0.8; font-size: 0.7rem; }
    }
  `]
})
export class AdminAcademicComponent implements OnInit {
  activeSection = 'schedule'; // Default to schedule for now
  modulesToValidate = [
    { module: 'Développement Web (DSI2)', chef: 'M. Ali' },
    { module: 'Base de Données (DSI3)', chef: 'Mme. Salma' }
  ];

  schedules: any[] = [];
  modules: any[] = [];
  classes: any[] = [];
  subjects: any[] = [];
  staffMembers: any[] = [];

  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  types = ['Cours', 'TD', 'TP'];

  newSchedule = {
    day: 'Lundi',
    startTime: '08:30',
    endTime: '10:00',
    module: '',
    subject: '',
    classGroup: '',
    staff: '',
    room: '',
    type: 'Cours'
  };

  selectedClassFilter: string = '';

  displayModal: boolean = false;
  validationError: string = '';
  modalData = {
    day: '',
    startTime: '',
    endTime: ''
  };

  timeSlots = [
    { start: '08:30', end: '10:00', label: 'S1: 08:30 - 10:00' },
    { start: '10:10', end: '11:40', label: 'S2: 10:10 - 11:40' },
    { start: '11:50', end: '13:20', label: 'S3: 11:50 - 13:20' },
    { start: '13:30', end: '15:00', label: 'S4: 13:30 - 15:00' },
    { start: '15:10', end: '16:40', label: 'S5: 15:10 - 16:40' },
    { start: '16:40', end: '18:10', label: 'S6: 16:40 - 18:10' }
  ];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getUsers().subscribe(users => {
      this.staffMembers = users.filter(u => u.role === 'staff');
    });
    this.adminService.getModules().subscribe(m => this.modules = m);
    this.adminService.getClasses().subscribe(c => this.classes = c);
    this.adminService.getSubjects().subscribe(sub => this.subjects = sub);
    this.adminService.getSchedules().subscribe(s => {
      this.schedules = s;
    });
  }

  onClassFilterChange() {
    // Auto-fill the add form with the selected class
    if (this.selectedClassFilter) {
      this.newSchedule.classGroup = this.selectedClassFilter;
    }
  }

  openModal(day: string, startTime: string, endTime: string) {
    if (!this.selectedClassFilter) {
      alert('Veuillez d\'abord sélectionner une classe.');
      return;
    }

    this.modalData = { day, startTime, endTime };
    this.newSchedule.day = day;
    this.newSchedule.startTime = startTime;
    this.newSchedule.endTime = endTime;
    this.newSchedule.classGroup = this.selectedClassFilter;
    this.validationError = '';
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
    this.validationError = '';
    this.newSchedule.staff = '';
    this.newSchedule.room = '';
  }

  validateSchedule(): boolean {
    try {
      if (!this.newSchedule.classGroup || !this.newSchedule.day || !this.newSchedule.startTime) {
        return false;
      }

      const currentClassId = this.newSchedule.classGroup.toString();

      // Check for class conflict
      const classConflict = this.schedules.find(s => {
        if (!s || !s.classGroup) return false;
        const sClassId = typeof s.classGroup === 'object' ? s.classGroup._id?.toString() : s.classGroup.toString();

        return sClassId === currentClassId &&
          s.day === this.newSchedule.day &&
          s.startTime === this.newSchedule.startTime;
      });

      if (classConflict) {
        this.validationError = `La classe ${this.getClassName(this.newSchedule.classGroup)} a déjà une séance à ce créneau.`;
        return false;
      }

      // Check for room conflict
      const roomConflict = this.schedules.find(s => {
        if (!s || !s.room || !this.newSchedule.room) return false;
        return s.room.toLowerCase().trim() === this.newSchedule.room.toLowerCase().trim() &&
          s.day === this.newSchedule.day &&
          s.startTime === this.newSchedule.startTime;
      });

      if (roomConflict) {
        this.validationError = `La salle ${this.newSchedule.room} est déjà occupée à ce créneau.`;
        return false;
      }

      return true;
    } catch (e) {
      console.error('Error in validateSchedule:', e);
      this.validationError = 'Erreur lors de la validation locale.';
      return false;
    }
  }

  addSchedule() {
    console.log('Attempting to add schedule:', this.newSchedule);
    try {
      if (!this.newSchedule.classGroup || !this.newSchedule.staff || !this.newSchedule.room || !this.newSchedule.subject) {
        console.warn('Missing required fields:', this.newSchedule);
        this.validationError = 'Veuillez remplir tous les champs obligatoires.';
        return;
      }

      // Validate before sending to server
      if (!this.validateSchedule()) {
        console.warn('Frontend validation failed:', this.validationError);
        return;
      }

      console.log('Sending request to server...');
      this.adminService.createSchedule(this.newSchedule).subscribe({
        next: (res) => {
          console.log('Schedule created successfully:', res);
          this.loadData();
          this.closeModal();
        },
        error: (err) => {
          console.error('Server error creating schedule:', err);
          if (err.status === 409) {
            this.validationError = err.error.message || 'Conflit détecté lors de la création.';
          } else {
            this.validationError = 'Erreur lors de la création de la séance: ' + (err.error?.message || err.message);
          }
        }
      });
    } catch (e) {
      console.error('Runtime error in addSchedule:', e);
      this.validationError = 'Une erreur inattendue est survenue.';
    }
  }

  deleteSchedule(id: string) {
    if (confirm('Supprimer cette séance ?')) {
      this.adminService.deleteSchedule(id).subscribe(() => this.loadData());
    }
  }

  // Helper for List View (legacy support)
  getSchedulesForDay(day: string) {
    let filtered = this.schedules.filter(s => s.day === day);

    if (this.selectedClassFilter) {
      filtered = filtered.filter(s => {
        // Check if classGroup is an object (populated) or string ID
        const sClassId = typeof s.classGroup === 'object' ? s.classGroup._id?.toString() : s.classGroup.toString();
        const filterId = this.selectedClassFilter.toString();
        return String(sClassId) === String(filterId);
      });
    }

    return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  getSession(day: string, slotStart: string) {
    if (!this.selectedClassFilter) return null;

    const session = this.schedules.find(s => {
      if (!s || !s.day || !s.startTime || !s.classGroup) return false;

      const sClassId = typeof s.classGroup === 'object' ? s.classGroup._id?.toString() : s.classGroup.toString();
      const filterId = this.selectedClassFilter.toString();

      return s.day === day &&
        s.startTime?.trim() === slotStart?.trim() &&
        String(sClassId) === String(filterId);
    });

    return session;
  }

  // Quick add from grid - now opens modal
  openAddModal(day: string, startTime: string, endTime: string) {
    this.openModal(day, startTime, endTime);
  }

  getClassName(id: string): string {
    const c = this.classes.find(Item => Item._id === id);
    return c ? c.name : '';
  }
}
