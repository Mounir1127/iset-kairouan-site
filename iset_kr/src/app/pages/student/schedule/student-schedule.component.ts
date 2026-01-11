import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-student-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="schedule-container">
      <header class="page-header animate-fade-in">
        <div class="title-area">
          <h1>Mon Emploi du <span class="highlight">Temps</span></h1>
          <p class="text-muted">Consultez votre emploi du temps hebdomadaire officiel.</p>
        </div>
        <div class="actions">
          <button class="btn btn-primary" (click)="printSchedule()">
            <i class="fas fa-print me-2"></i> Imprimer
          </button>
        </div>
      </header>

      <div class="schedule-grid-wrapper animate-fade-up">
        <div class="table-responsive glass-card">
          <table class="schedule-table">
            <thead>
              <tr>
                <th>Heure</th>
                <th *ngFor="let day of days">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let slot of timeSlots">
                <td class="time-slot">{{ slot }}</td>
                <td *ngFor="let day of days">
                  <div class="session-box" *ngIf="getSession(day, slot) as session" [class]="session.type.toLowerCase()">
                    <span class="subject">{{ session.subject?.name }}</span>
                    <span class="module">{{ session.module?.name }}</span>
                    <div class="info-row">
                      <span class="room"><i class="fas fa-map-marker-alt"></i> {{ session.room }}</span>
                      <span class="staff"><i class="fas fa-user-tie"></i> {{ session.staff?.name }}</span>
                    </div>
                    <span class="type-tag">{{ session.type }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .schedule-container { display: flex; flex-direction: column; gap: 2rem; }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h1 { font-size: 2rem; font-weight: 800; color: #0f172a; .highlight { color: #0055a4; } }
    }

    .glass-card {
      background: white;
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      border: 1px solid #f1f5f9;
    }

    .schedule-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 10px;
      
      th {
        text-align: center;
        padding: 1rem;
        font-weight: 800;
        color: #475569;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 1px;
      }

      .time-slot {
        font-weight: 700;
        color: #0055a4;
        background: #f8fafc;
        border-radius: 12px;
        padding: 1rem;
        text-align: center;
        width: 120px;
        font-size: 0.9rem;
      }
    }

    .session-box {
      background: #eff6ff;
      border-left: 4px solid #0055a4;
      padding: 1rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      min-height: 100px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover { transform: scale(1.02); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

      .subject { font-weight: 800; font-size: 0.95rem; color: #1e3a8a; }
      .module { font-size: 0.75rem; color: #64748b; font-weight: 600; }
      
      .info-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: #475569;
        margin-top: 0.5rem;
        i { color: #f59e0b; margin-right: 3px; }
      }

      .type-tag {
        position: absolute;
        top: 0;
        right: 0;
        background: #0055a4;
        color: white;
        font-size: 0.65rem;
        padding: 2px 8px;
        border-bottom-left-radius: 8px;
        font-weight: 800;
      }

      &.td { background: #fef3c7; border-left-color: #f59e0b; .type-tag { background: #f59e0b; } .subject { color: #92400e; } }
      &.tp { background: #ecfdf5; border-left-color: #10b981; .type-tag { background: #10b981; } .subject { color: #065f46; } }
    }

    .btn-primary {
      background: #0055a4;
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 85, 164, 0.2);
    }

    .animate-fade-in { animation: fadeIn 0.6s ease-out; }
    .animate-fade-up { animation: fadeUp 0.6s ease-out both; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class StudentScheduleComponent implements OnInit {
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots = ['08:30', '10:15', '13:30', '15:15'];
  scheduleItems: any[] = [];
  currentUser: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule(): void {
    const classGroupId = this.currentUser?.classGroup?._id || this.currentUser?.classGroup;
    if (!classGroupId) return;

    this.http.get<any[]>('/api/student/schedule', {
      params: { classGroupId }
    }).subscribe({
      next: (data) => this.scheduleItems = data,
      error: (err) => console.error('Error loading schedule', err)
    });
  }

  getSession(day: string, slot: string) {
    return this.scheduleItems.find(s => s.day === day && s.startTime === slot);
  }

  printSchedule() {
    window.print();
  }
}
