import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';

@Component({
    selector: 'app-admin-messages',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="messages-container animate-on-scroll slide-up">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 class="display-5 fw-black text-navy mb-2">Messagerie <span class="text-gold">Contact</span></h1>
          <p class="text-secondary">Gérez les demandes et messages reçus via le formulaire de contact public.</p>
        </div>
        <div class="stats-badge bg-gold-subtle p-3 rounded-4 border border-gold d-flex align-items-center gap-3">
          <div class="icon-circle bg-gold text-white shadow-sm">
            <i class="fas fa-envelope"></i>
          </div>
          <div>
            <div class="fw-black text-navy h4 mb-0">{{ unreadCount }}</div>
            <div class="small fw-bold text-uppercase text-gold" style="letter-spacing: 1px;">Non lus</div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12" *ngFor="let msg of messages; let i = index">
          <div class="card message-card border-0 shadow-sm rounded-4 overflow-hidden" 
               [class.unread]="msg.status === 'pending'"
               [style.animation-delay]="(i * 0.1) + 's'">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar-circle shadow-sm" [class.bg-blue]="msg.status === 'pending'" [class.bg-secondary]="msg.status !== 'pending'">
                    {{ msg.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h5 class="fw-bold text-navy mb-0">{{ msg.name }}</h5>
                    <div class="small text-secondary">{{ msg.email }}</div>
                  </div>
                </div>
                <div class="text-end">
                  <div class="small fw-bold text-muted mb-1">{{ msg.createdAt | date:'dd/MM/yyyy HH:mm' }}</div>
                  <span class="badge" [class.bg-gold]="msg.status === 'pending'" [class.bg-light-blue]="msg.status === 'read'">
                    {{ msg.status === 'pending' ? 'NOUVEAU' : 'LU' }}
                  </span>
                </div>
              </div>

              <div class="message-content p-3 bg-light rounded-3 mb-4">
                <p class="mb-0 text-navy" style="white-space: pre-wrap;">{{ msg.message }}</p>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button *ngIf="msg.status === 'pending'" (click)="markAsRead(msg._id)" 
                        class="btn-action btn-read shadow-sm" title="Marquer comme lu">
                  <i class="fas fa-check"></i> Marquer comme lu
                </button>
                <button (click)="deleteMessage(msg._id)" class="btn-action btn-delete shadow-sm" title="Supprimer">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 text-center py-5" *ngIf="messages.length === 0">
          <div class="empty-state">
            <i class="fas fa-inbox display-1 text-light-blue mb-4"></i>
            <h3 class="text-navy">Aucun message pour le moment</h3>
            <p class="text-secondary">Les messages reçus via le formulaire de contact apparaîtront ici.</p>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .messages-container {
      padding: 1rem;
    }

    .message-card {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border-left: 5px solid transparent !important;
      
      &.unread {
        border-left-color: #c5a021 !important;
        background: #fdfaf0;
      }

      &:hover {
        transform: translateX(10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08) !important;
      }
    }

    .avatar-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 1.2rem;
    }

    .bg-blue { background: #0055a4; }
    .bg-light-blue { background: rgba(0, 85, 164, 0.1); color: #0055a4; }
    .bg-gold { background: #c5a021; color: white; }
    .bg-gold-subtle { background: rgba(197, 160, 33, 0.05); }

    .icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .message-content {
      border: 1px solid rgba(0,0,0,0.03);
      line-height: 1.6;
    }

    .btn-action {
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;

      &.btn-read {
        background: #0055a4;
        color: white;
        &:hover { background: #003d7a; }
      }

      &.btn-delete {
        background: #f8fafc;
        color: #ef4444;
        &:hover { background: #fee2e2; }
      }
    }

    .empty-state {
      opacity: 0.5;
      i { color: #0055a4; }
    }
  `]
})
export class AdminMessagesComponent implements OnInit {
    messages: any[] = [];
    unreadCount = 0;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.loadMessages();
    }

    loadMessages(): void {
        this.dataService.getAdminContacts().subscribe(data => {
            this.messages = data;
            this.unreadCount = data.filter(m => m.status === 'pending').length;
        });
    }

    markAsRead(id: string): void {
        this.dataService.markContactAsRead(id).subscribe(() => {
            this.loadMessages();
        });
    }

    deleteMessage(id: string): void {
        if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
            this.dataService.deleteContactMessage(id).subscribe(() => {
                this.loadMessages();
            });
        }
    }
}
