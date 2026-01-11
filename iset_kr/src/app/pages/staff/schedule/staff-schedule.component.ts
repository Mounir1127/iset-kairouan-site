import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../../services/staff.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-staff-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="schedule-page">
      <!-- HEADER -->
      <div class="header-wrap glass-card">
        <div class="header-main">
          <div class="title-wrap">
            <h2>Mon Emploi du Temps</h2>
            <p>Consultez votre planning hebdomadaire, vos salles et vos horaires.</p>
          </div>
          <!-- Actions removed as requested -->
        </div>
        <div class="semester-info">
          <span class="info-tag"><i class="fas fa-university"></i> Année Univ. 2024/2025</span>
          <span class="info-tag current"><i class="fas fa-history"></i> Semestre 1</span>
        </div>
      </div>

      <!-- LOADING STATE -->
      <div class="loading-state glass-card" *ngIf="isLoading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Chargement de votre emploi du temps...</p>
      </div>

      <!-- SCHEDULE GRID -->
      <div class="schedule-grid-container glass-card" *ngIf="!isLoading">
        <div class="schedule-table">
          <div class="time-column">
            <div class="time-slot header">Heure</div>
            <div class="time-slot" *ngFor="let slot of timeSlots">{{ slot }}</div>
          </div>
          
          <div class="day-columns">
            <div class="day-column" *ngFor="let day of weekDays">
              <div class="day-header" [class.today]="isToday(day)">
                <span class="day-name">{{ day }}</span>
              </div>
              <div class="day-slots">
                <ng-container *ngFor="let slot of timeSlots">
                  <div class="class-slot" [ngClass]="getClassForSlot(day, slot)?.type" 
                       *ngIf="getClassForSlot(day, slot) as session">
                    <span class="module">{{ session.subject?.name || session.module }}</span>
                    <span class="group"><i class="fas fa-users"></i> {{ session.classGroup?.name }}</span>
                    <span class="room"><i class="fas fa-location-arrow"></i> {{ session.room }}</span>
                  </div>
                  <div class="empty-slot" *ngIf="!getClassForSlot(day, slot)"></div>
                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LEGEND -->
      <div class="schedule-legend glass-card" *ngIf="!isLoading">
        <div class="legend-item"><span class="color-box cours"></span> Cours</div>
        <div class="legend-item"><span class="color-box td"></span> TD (Travaux Dirigés)</div>
        <div class="legend-item"><span class="color-box tp"></span> TP (Travaux Pratiques)</div>
      </div>
    </div>
  `,
  styles: [`
    .schedule-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      animation: fadeIn 0.8s ease;
    }

    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 24px;
      padding: 2.2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    }

    .loading-state {
      text-align: center;
      padding: 4rem;
      i { font-size: 3rem; color: #0055a4; margin-bottom: 1rem; }
      p { color: #64748b; font-weight: 600; }
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      
      h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; }
      p { color: #64748b; font-weight: 500; }
      
      .actions {
        display: flex;
        gap: 1rem;
        button {
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s;
        }
        .btn-primary { background: #0055a4; color: white; border: none; &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 85, 164, 0.2); } }
        .btn-outline { background: white; color: #0055a4; border: 1px solid #0055a4; &:hover { background: #eff6ff; } }
      }
    }

    .semester-info {
      display: flex;
      gap: 1.5rem;
      .info-tag {
        font-size: 0.85rem;
        font-weight: 700;
        color: #64748b;
        background: #f1f5f9;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        &.current { color: #d97706; background: #fffbeb; }
      }
    }

    /* SCHEDULE GRID */
    .schedule-grid-container {
      padding: 0;
      overflow: hidden;
    }

    .schedule-table {
      display: grid;
      grid-template-columns: 80px 1fr;
      min-width: 1000px;
    }

    .time-slot {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 800;
      color: #94a3b8;
      border-right: 1px solid #f1f5f9;
      &.header { height: 60px; border-bottom: 1px solid #f1f5f9; }
    }

    .day-columns {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
    }

    .day-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      border-bottom: 1px solid #f1f5f9;
      border-right: 1px solid #f1f5f9;
      .day-name { font-weight: 850; font-size: 0.9rem; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
      &.today { background: #0055a4; .day-name { color: white; } }
    }

    .class-slot {
      height: 100px;
      padding: 0.8rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.2rem;
      border-right: 1px solid #f1f5f9;
      border-bottom: 1px solid #f1f5f9;
      transition: all 0.3s;
      cursor: pointer;

      .module { font-size: 0.85rem; font-weight: 900; color: white; line-height: 1.2; }
      .group, .room { font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.85); display: flex; align-items: center; gap: 0.4rem; }
      
      &.cours { background: #0055a4; border-left: 4px solid #f59e0b; }
      &.td { background: #475569; border-left: 4px solid #94a3b8; }
      &.tp { background: #10b981; border-left: 4px solid #f59e0b; }

      &:hover { transform: scale(1.05); z-index: 2; box-shadow: 0 10px 20px rgba(0,0,0,0.15); border-radius: 8px; }
    }

    .empty-slot {
      height: 100px;
      border-right: 1px solid #f1f5f9;
      border-bottom: 1px solid #f1f5f9;
    }

    .schedule-legend {
      display: flex;
      gap: 2rem;
      padding: 1.5rem 2.2rem;
      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-weight: 700;
        font-size: 0.9rem;
        color: #0f172a;
        .color-box {
          width: 15px;
          height: 15px;
          border-radius: 4px;
          &.cours { background: #0055a4; }
          &.td { background: #475569; }
          &.tp { background: #10b981; }
        }
      }
    }

    @media (max-width: 1024px) {
      .schedule-grid-container { overflow-x: auto; }
    }

    @media print {
      .header-main .actions, .loading-state { display: none !important; }
      .glass-card { box-shadow: none !important; border: 1px solid #eee !important; backdrop-filter: none !important; padding: 0 !important; }
      .schedule-page { gap: 1rem; }
      .schedule-grid-container { overflow: visible !important; }
      .schedule-table { min-width: auto !important; width: 100% !important; }
      
      /* Ensure colors are printed */
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  `]
})
export class StaffScheduleComponent implements OnInit {
  timeSlots = [
    '08:30 - 10:00',
    '10:10 - 11:40',
    '11:50 - 13:20',
    '13:30 - 15:00',
    '15:10 - 16:40',
    '16:40 - 18:10'
  ];
  weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  sessions: any[] = [];
  isLoading = true;
  currentUser: any;

  constructor(
    private staffService: StaffService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.id) {
      this.loadSchedule();
    } else {
      this.isLoading = false;
    }
  }

  loadSchedule(): void {
    this.isLoading = true;
    this.staffService.getSchedule(this.currentUser.id).subscribe({
      next: (schedules) => {
        // console.log('Schedules loaded:', schedules);
        this.sessions = schedules.map(s => ({
          ...s,
          slot: `${s.startTime} - ${s.endTime}`,
          type: s.type?.toLowerCase() || 'cours'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading schedule:', err);
        this.sessions = [];
        this.isLoading = false;
      }
    });
  }

  isToday(day: string): boolean {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return day === days[new Date().getDay()];
  }

  getClassForSlot(day: string, slot: string) {
    return this.sessions.find(s => s.day === day && s.slot === slot);
  }
}
